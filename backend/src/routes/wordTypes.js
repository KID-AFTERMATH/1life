const router = require('express').Router();
const { query } = require('../db');

/**
 * GET /api/word-types
 * Returns all grammatical word types.
 */
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, name FROM word_types ORDER BY id ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
