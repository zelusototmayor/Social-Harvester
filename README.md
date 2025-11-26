# Signal Harvester

A modern landing page for Signal Harvester - an AI-powered social media engagement automation tool.

## Overview

Signal Harvester helps businesses automate responses to potential customers on social media platforms like Instagram and TikTok, turning social signals into sales opportunities.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS** for styling
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **PostgreSQL** database for waitlist storage
- **Docker** for containerization

### Deployment
- **Kamal** for zero-downtime deployments
- **Traefik** for automatic SSL/HTTPS (Let's Encrypt)
- **Digital Ocean** droplets (recommended)

## Project Structure

```
signal-harvester/
├── components/          # React components
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── ExamplesCarousel.tsx
│   ├── CompetitorAd.tsx
│   └── WaitlistForm.tsx
├── server/              # Backend Express server
│   ├── index.js        # Main server file
│   ├── db.js           # Database connection & queries
│   └── package.json    # Backend dependencies
├── config/              # Deployment configuration
│   └── deploy.yml      # Kamal deployment config
├── App.tsx             # Main React app
├── types.ts            # TypeScript type definitions
├── Dockerfile          # Multi-stage Docker build
└── package.json        # Frontend dependencies
```

## Local Development

### Prerequisites
- Node.js 20+ installed
- PostgreSQL installed (for local development)

### Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Set up local database:**
   ```bash
   # Create database
   createdb signal_harvester

   # Set environment variable
   export DATABASE_URL="postgresql://postgres:password@localhost:5432/signal_harvester"
   ```

4. **Run development servers:**

   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```

   Terminal 2 (Backend):
   ```bash
   cd server
   npm run dev
   ```

5. **Access the app:**
   - Frontend: http://localhost:5173 (Vite dev server)
   - Backend API: http://localhost:3000/api/waitlist

### Production Build (Local Testing)

```bash
# Build frontend
npm run build

# Start backend (serves built frontend + API)
cd server
npm start
```

Then visit http://localhost:3000

## Deployment to Digital Ocean

This project is configured for easy deployment using Kamal. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step instructions.

### Quick Start

1. Install Kamal:
   ```bash
   gem install kamal
   ```

2. Configure deployment:
   - Edit `config/deploy.yml` with your droplet IP and domain
   - Copy `.env.example` to `.env` and fill in your secrets

3. Deploy:
   ```bash
   kamal setup
   ```

## Features

- ✅ **Responsive Design** - Works on all devices
- ✅ **SEO Optimized** - Meta tags and semantic HTML
- ✅ **Fast Loading** - Optimized assets and code splitting
- ✅ **Working Waitlist** - PostgreSQL-backed email collection
- ✅ **HTTPS/SSL** - Automatic certificate management
- ✅ **Zero-Downtime Deployments** - Via Kamal
- ✅ **Health Checks** - Built-in monitoring endpoints

## API Endpoints

### POST `/api/waitlist`
Add email to waitlist

**Request:**
```json
{
  "email": "user@example.com",
  "platform": "Instagram"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "data": {
    "email": "user@example.com",
    "platform": "Instagram",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET `/up`
Health check endpoint (used by Kamal)

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345
}
```

## Database Schema

### `waitlist` Table
```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

See `.env.example` for all required environment variables:

- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `KAMAL_REGISTRY_PASSWORD` - Docker Hub access token
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password

## Scripts

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with auto-reload

## Contributing

This is a private project for Signal Harvester's product launch. Internal contributions only.

## License

All rights reserved. © 2024 Signal Harvester

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For general questions, contact the development team.
