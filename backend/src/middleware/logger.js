/**
 * Simple request logger.
 * Logs method, URL, status, and elapsed time on response.
 */
module.exports = function logger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    const ts = new Date().toISOString();
    console.log(
      `${ts} ${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedMs.toFixed(1)}ms`
    );
  });

  next();
};
