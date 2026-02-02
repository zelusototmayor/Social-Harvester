source "https://rubygems.org"

# Rails 8
gem "rails", "~> 8.0.4"

# Database
gem "pg", "~> 1.1"

# Web server
gem "puma", ">= 5.0"

# Background jobs
gem "sidekiq", "~> 7.0"
gem "sidekiq-cron", "~> 1.12"
gem "redis", "~> 5.0"

# Authentication
gem "devise", "~> 4.9"
gem "devise-jwt", "~> 0.11"

# HTTP client for external APIs
gem "httparty", "~> 0.21"
gem "faraday", "~> 2.7"

# Payments
gem "stripe", "~> 12.0"

# JSON serialization
gem "jsonapi-serializer", "~> 2.2"

# CORS
gem "rack-cors", "~> 2.0"

# Rate limiting
gem "rack-attack", "~> 6.7"

# Windows timezone data
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

# Rails 8 defaults
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Boot optimization
gem "bootsnap", require: false

# Deployment
gem "kamal", "~> 2.0", require: false
gem "thruster", require: false

group :development, :test do
  gem "debug", platforms: %i[ mri mingw mswin x64_mingw ], require: "debug/prelude"
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
  gem "dotenv-rails", "~> 3.1"
end

group :development do
  gem "annotate"
end

gem "connection_pool", "~> 2.4"
