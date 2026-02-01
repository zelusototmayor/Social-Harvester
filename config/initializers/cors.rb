# Be sure to restart your server when you modify this file.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # In production, require FRONTEND_URL to be explicitly set
    # In development, allow localhost origins
    if Rails.env.production?
      frontend_url = ENV['FRONTEND_URL']
      if frontend_url.blank?
        Rails.logger.warn "CORS: FRONTEND_URL not set in production! CORS will be restrictive."
        origins 'https://localhost' # Effectively blocks all requests
      else
        origins frontend_url
      end
    else
      # Development: allow common localhost ports
      origins 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000',
              'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
              'http://127.0.0.1:3000', 'http://127.0.0.1:4000', 'http://127.0.0.1:5173'
    end

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ["Authorization"],
      credentials: true
  end
end
