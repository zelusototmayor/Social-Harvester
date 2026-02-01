# Security headers configuration
# These headers help protect against common web vulnerabilities

Rails.application.config.action_dispatch.default_headers = {
  # Prevent clickjacking by not allowing the page to be framed
  'X-Frame-Options' => 'SAMEORIGIN',

  # Prevent MIME type sniffing
  'X-Content-Type-Options' => 'nosniff',

  # Enable XSS filter in older browsers
  'X-XSS-Protection' => '1; mode=block',

  # Control what information is sent in the Referer header
  'Referrer-Policy' => 'strict-origin-when-cross-origin',

  # Restrict browser features
  'Permissions-Policy' => 'camera=(), microphone=(), geolocation=()'
}

# Content Security Policy
# Note: This is a relatively permissive CSP suitable for a SPA with external CDNs
# Adjust based on your specific needs
if Rails.env.production?
  Rails.application.config.content_security_policy do |policy|
    policy.default_src :self
    policy.font_src    :self, :data, 'https://fonts.gstatic.com'
    policy.img_src     :self, :data, :blob, 'https:'
    policy.object_src  :none
    policy.script_src  :self, :unsafe_inline, 'https://cdn.tailwindcss.com', 'https://cdn.mxpnl.com'
    policy.style_src   :self, :unsafe_inline, 'https://fonts.googleapis.com', 'https://cdn.tailwindcss.com'
    policy.connect_src :self, 'https://api.mixpanel.com', 'https://api-js.mixpanel.com'
    policy.frame_ancestors :none
    policy.base_uri    :self
    policy.form_action :self
  end

  # Generate a nonce for inline scripts (optional, for stricter CSP)
  # Rails.application.config.content_security_policy_nonce_generator = ->(request) { SecureRandom.base64(16) }
end
