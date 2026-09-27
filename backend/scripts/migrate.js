/**
 * Utility script that applies schema.sql and seed.sql to the
 * database pointed at by DATABASE_URL. Useful when not running
 * via docker-compose's init directory.
 *
 * Usage: npm run migrate
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db');

async function run() {
  const dbDir = path.join(__dirname, '..', 'db');

  for (const file of ['schema.sql', 'seed.sql']) {
    const fullPath = path.join(dbDir, file);
    const sql = fs.readFileSync(fullPath, 'utf8');
    console.log(`[migrate] applying ${file}...`);
    await pool.query(sql);
    console.log(`[migrate] ${file} applied`);
  }

  await pool.end();
  console.log('[migrate] done');
}

run().catch((err) => {
  console.error('[migrate] failed', err);
  process.exit(1);
});
