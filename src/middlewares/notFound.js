function notFound(req, res, next) {
  if (res.headersSent) return next();
  return res.status(404).json(`🔍 - Not Found - ${req.originalUrl}`);
}
module.exports = notFound;
