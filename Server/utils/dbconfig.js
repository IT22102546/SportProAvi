import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sportspro',
  password: process.env.DB_PASSWORD || 'yourpassword',
  port: process.env.DB_PORT || 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to try connecting before timing out
});

// Test the connection on startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('Successfully connected to PostgreSQL database');
  }
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect...');
  } else {
    throw err;
  }
});

// Graceful shutdown handler
process.on('SIGINT', () => {
  pool.end()
    .then(() => {
      console.log('Database pool closed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error closing database pool:', err);
      process.exit(1);
    });
});

export default pool;