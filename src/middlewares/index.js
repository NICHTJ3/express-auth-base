const validateBody = require('./validateBody');
const {
  checkTokenSetUser,
  getTokenFromRequest,
  getTokenFromBearer,
  ensureLoggedIn
} = require('./auth');

function notFound(req, res, next) {
  if (res.headersSent) return next();
  return res.status(404).json(`🔍 - Not Found - ${req.originalUrl}`);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = {
  notFound,
  errorHandler,
  validateBody,
  checkTokenSetUser,
  getTokenFromRequest,
  getTokenFromBearer,
  ensureLoggedIn
};
