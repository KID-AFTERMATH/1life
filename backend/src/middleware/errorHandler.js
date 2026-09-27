/**
 * Central error handler.
 * Any `next(err)` from a route lands here.
 */
module.exports = function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
