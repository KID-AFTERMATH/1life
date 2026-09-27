/**
 * Application entry point.
 * Wires middleware, mounts routers, and starts the HTTP server.
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const wordTypesRouter = require('./routes/wordTypes');
const wordsRouter = require('./routes/words');
const sentencesRouter = require('./routes/sentences');

const app = express();

// --- Global middleware ---
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(logger);

// --- Routes ---
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/word-types', wordTypesRouter);
app.use('/api/words', wordsRouter);
app.use('/api/sentences', sentencesRouter);

// --- Fallthrough handlers (must come last) ---
app.use(notFound);
app.use(errorHandler);

// --- Start server ---
const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
  console.log(`[api] env: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown so Docker stop signals are handled cleanly
const shutdown = (signal) => {
  console.log(`[api] received ${signal}, shutting down...`);
  server.close(() => {
    console.log('[api] closed');
    process.exit(0);
  });
  // Force exit if connections hang
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app; // exported for tests
