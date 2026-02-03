# Multi-stage Dockerfile for Signal Harvester
# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY client/ ./

# Build the frontend (outputs to ../public for Rails)
RUN npm run build

# Stage 2: Build Rails app
FROM ruby:3.2.4-alpine AS rails-builder

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    git

WORKDIR /app

# Install Ruby dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install --jobs 4

# Stage 3: Production image
FROM ruby:3.2.4-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    postgresql-client \
    tzdata \
    nodejs

WORKDIR /app

# Copy installed gems from builder
COPY --from=rails-builder /usr/local/bundle /usr/local/bundle

# Copy application code
COPY . .

# Copy built frontend assets from frontend builder
COPY --from=frontend-builder /app/public ./public

# Remove unnecessary files
RUN rm -rf client node_modules tmp/cache spec test

# Set environment variables
ENV RAILS_ENV=production \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_SERVE_STATIC_FILES=true \
    BUNDLE_DEPLOYMENT=true \
    BUNDLE_WITHOUT="development:test"

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/up || exit 1

# Precompile bootsnap (boot optimization) - optional, continue if fails
RUN bundle exec bootsnap precompile --gemfile app/ lib/ || true

# Start the server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
