const router = require('express').Router();
const pool = require('../db');

// GET /api/sentences  → list all, newest first
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, content, created_at, updated_at FROM sentences ORDER BY updated_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/sentences/:id  → get one
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, content, created_at, updated_at FROM sentences WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sentence not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/sentences  → create
router.post('/', async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required' });
    }

    const result = await pool.query(
      'INSERT INTO sentences (content) VALUES ($1) RETURNING id, content, created_at, updated_at',
      [content.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/sentences/:id  → update
router.put('/:id', async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required' });
    }

    const result = await pool.query(
      `UPDATE sentences
         SET content = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, content, created_at, updated_at`,
      [content.trim(), req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sentence not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;