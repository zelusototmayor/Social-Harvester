import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase, addToWaitlist, closeDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline styles for Tailwind
}));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window per IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://signalharvester.com', 'https://www.signalharvester.com']
    : true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.post('/api/waitlist', apiLimiter, async (req, res) => {
  try {
    const { email, platform } = req.body;

    // Validation
    if (!email || !platform) {
      return res.status(400).json({
        error: 'Email and platform are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate platform
    const validPlatforms = ['Instagram', 'TikTok'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        error: 'Invalid platform. Must be Instagram or TikTok'
      });
    }

    // Add to database
    const result = await addToWaitlist(email.toLowerCase().trim(), platform);

    res.status(201).json({
      success: true,
      message: 'Successfully added to waitlist',
      data: {
        email: result.email,
        platform: result.platform,
        created_at: result.created_at
      }
    });
  } catch (error) {
    console.error('Error in /api/waitlist:', error);
    res.status(500).json({
      error: 'Failed to add to waitlist. Please try again later.'
    });
  }
});

// Health check endpoint for Kamal
app.get('/up', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files from the React app build
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback - all other routes return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database schema
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

// Start the server
startServer();
