# Multi-stage Dockerfile for Signal Harvester
# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig.json vite.config.ts ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY components ./components
COPY *.tsx ./
COPY *.ts ./
COPY index.html ./
COPY metadata.json ./

# Build the frontend
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies for backend
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy backend server code
COPY server ./server

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Health check for Kamal
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/up', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server/index.js"]
