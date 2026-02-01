# Rate limiting configuration using Rack::Attack
# Protects against brute force attacks and API abuse

class Rack::Attack
  # Use Redis for tracking if available, otherwise use memory cache
  if ENV['REDIS_URL'].present?
    Rack::Attack.cache.store = ActiveSupport::Cache::RedisCacheStore.new(url: ENV['REDIS_URL'])
  end

  ### Throttle Rules ###

  # Limit login attempts by IP address
  # Allow 5 login attempts per 20 seconds per IP
  throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
    if req.path == '/api/auth/login' && req.post?
      req.ip
    end
  end

  # Limit login attempts by email
  # Allow 5 login attempts per minute per email
  throttle('logins/email', limit: 5, period: 60.seconds) do |req|
    if req.path == '/api/auth/login' && req.post?
      # Extract email from request body
      begin
        body = JSON.parse(req.body.read)
        req.body.rewind
        body.dig('user', 'email')&.downcase&.strip
      rescue
        nil
      end
    end
  end

  # Limit registration attempts
  # Allow 3 registration attempts per hour per IP
  throttle('registrations/ip', limit: 3, period: 1.hour) do |req|
    if req.path == '/api/auth/register' && req.post?
      req.ip
    end
  end

  # Limit password reset requests
  # Allow 3 password reset requests per hour per IP
  throttle('password_resets/ip', limit: 3, period: 1.hour) do |req|
    if req.path == '/api/auth/password' && req.post?
      req.ip
    end
  end

  # General API rate limiting
  # Allow 100 requests per minute per IP for authenticated endpoints
  throttle('api/ip', limit: 100, period: 1.minute) do |req|
    if req.path.start_with?('/api/') && !req.path.start_with?('/api/auth/')
      req.ip
    end
  end

  # Scan endpoint rate limiting (expensive operation)
  # Allow 10 scan triggers per hour per IP
  throttle('scans/ip', limit: 10, period: 1.hour) do |req|
    if req.path.match?(/\/api\/products\/\d+\/trigger_scan/) && req.post?
      req.ip
    end
  end

  ### Blocklist Rules ###

  # Block requests from bad user agents
  blocklist('block/bad_ua') do |req|
    bad_user_agents = ['curl', 'wget', 'python-requests']
    ua = req.user_agent&.downcase || ''

    # Only block in production and only for auth endpoints
    if Rails.env.production? && req.path.start_with?('/api/auth/')
      bad_user_agents.any? { |bad_ua| ua.include?(bad_ua) }
    else
      false
    end
  end

  ### Response Configuration ###

  # Return a 429 Too Many Requests response
  self.throttled_responder = lambda do |env|
    retry_after = (env['rack.attack.match_data'] || {})[:period]

    [
      429,
      {
        'Content-Type' => 'application/json',
        'Retry-After' => retry_after.to_s
      },
      [{ error: 'Too many requests. Please try again later.' }.to_json]
    ]
  end

  # Return a 403 Forbidden for blocked requests
  self.blocklisted_responder = lambda do |env|
    [
      403,
      { 'Content-Type' => 'application/json' },
      [{ error: 'Access denied.' }.to_json]
    ]
  end
end

# Log throttled requests
ActiveSupport::Notifications.subscribe('throttle.rack_attack') do |name, start, finish, request_id, payload|
  req = payload[:request]
  Rails.logger.warn "[Rack::Attack] Throttled #{req.ip} on #{req.path}"
end
