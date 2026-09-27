/**
 * Shared PostgreSQL connection pool.
 * A single pool is reused across requests for efficiency.
 */
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.warn('[db] DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL is required for Azure; disable locally when not needed
  ssl: process.env.DATABASE_URL?.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[db] unexpected pool error', err);
});

/**
 * Convenience wrapper.
 * @param {string} text SQL text
 * @param {any[]} params SQL parameters
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
