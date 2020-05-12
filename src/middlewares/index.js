const validateBody = require('./validateBody');
const checkTokensSetUser = require('./checkTokensSetUser');
const ensureLoggedIn = require('./ensureLoggedIn');
const notFound = require('./notFound');
const errorHandler = require('./errorHandler');

module.exports = {
  notFound,
  errorHandler,
  validateBody,
  checkTokensSetUser,
  ensureLoggedIn
};
