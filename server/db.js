import pg from 'pg';
const { Pool } = pg;

// Database configuration from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database schema
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        platform VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
      CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
    `);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Add email to waitlist
export async function addToWaitlist(email, platform) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO waitlist (email, platform) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET platform = $2, created_at = NOW() RETURNING *',
      [email, platform]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Get waitlist count (optional utility function)
export async function getWaitlistCount() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM waitlist');
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Graceful shutdown
export async function closeDatabase() {
  await pool.end();
  console.log('Database connection pool closed');
}

export default pool;
