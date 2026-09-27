const router = require('express').Router();
const { query } = require('../db');

/**
 * GET /api/words?typeId=<number>
 * Returns all words belonging to the specified word type.
 */
router.get('/', async (req, res, next) => {
  try {
    const typeId = Number(req.query.typeId);

    if (!Number.isInteger(typeId) || typeId <= 0) {
      return res
        .status(400)
        .json({ error: 'typeId query parameter must be a positive integer' });
    }

    const { rows } = await query(
      `SELECT id, value, type_id
         FROM words
        WHERE type_id = $1
        ORDER BY value ASC`,
      [typeId]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
