const { Pool } = require('pg');

// A "Pool" manages multiple DB connections efficiently.
// Instead of opening/closing a connection per request, it reuses them.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Quick sanity check at startup
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error', err);
});

module.exports = pool;