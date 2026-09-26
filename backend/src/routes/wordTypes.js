const router = require('express').Router();
const pool = require('../db');

// GET /api/word-types
// Returns all grammatical word types, sorted alphabetically.
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM word_types ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    next(err); // hand off to the error middleware
  }
});

module.exports = router;