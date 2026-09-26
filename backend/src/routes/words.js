const router = require('express').Router();
const pool = require('../db');

// GET /api/words?typeId=3
// Returns all words for the given word type.
router.get('/', async (req, res, next) => {
  try {
    const { typeId } = req.query;

    if (!typeId) {
      return res.status(400).json({ error: 'typeId query parameter is required' });
    }

    const result = await pool.query(
      'SELECT id, value, type_id FROM words WHERE type_id = $1 ORDER BY value',
      [typeId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;