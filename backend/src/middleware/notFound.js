/**
 * Catches requests that didn't match any route.
 */
module.exports = function notFound(req, res) {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    method: req.method,
  });
};
