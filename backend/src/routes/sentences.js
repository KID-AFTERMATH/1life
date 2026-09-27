const router = require('express').Router();
const { query } = require('../db');

const MAX_CONTENT_LENGTH = 2000;

/**
 * Validates the content field of a request body.
 * @returns {string|null} Error message, or null if valid.
 */
function validateContent(body) {
  if (!body || typeof body.content !== 'string') {
    return 'content is required and must be a string';
  }
  const trimmed = body.content.trim();
  if (trimmed.length === 0) {
    return 'content must not be empty';
  }
  if (trimmed.length > MAX_CONTENT_LENGTH) {
    return `content must be at most ${MAX_CONTENT_LENGTH} characters`;
  }
  return null;
}

/**
 * GET /api/sentences
 * List all saved sentences, newest first.
 */
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, content, created_at, updated_at
         FROM sentences
        ORDER BY updated_at DESC, id DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sentences/:id
 * Fetch a single sentence by ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const { rows } = await query(
      `SELECT id, content, created_at, updated_at
         FROM sentences
        WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sentence not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sentences
 * Create a new sentence.
 */
router.post('/', async (req, res, next) => {
  try {
    const validationError = validateContent(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const content = req.body.content.trim();

    const { rows } = await query(
      `INSERT INTO sentences (content)
       VALUES ($1)
       RETURNING id, content, created_at, updated_at`,
      [content]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/sentences/:id
 * Update an existing sentence's content.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const validationError = validateContent(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const content = req.body.content.trim();

    const { rows } = await query(
      `UPDATE sentences
          SET content = $1,
              updated_at = NOW()
        WHERE id = $2
        RETURNING id, content, created_at, updated_at`,
      [content, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sentence not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/sentences/:id
 * Removes a sentence.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const result = await query('DELETE FROM sentences WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sentence not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
