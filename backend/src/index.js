require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Allow the Angular dev server to call us
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));

// Parse JSON bodies on POST/PUT
app.use(express.json());

// Simple request logger — nice for demos
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Mount routers under /api
app.use('/api/word-types', require('./routes/wordTypes'));
app.use('/api/words', require('./routes/words'));
app.use('/api/sentences', require('./routes/sentences'));

// Health endpoint (useful for Azure / Docker checks)
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Central error handler. Any next(err) lands here.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});