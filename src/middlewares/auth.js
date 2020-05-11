const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');
const auth = require('../api/auth/auth');

function ensureLoggedIn(req, res, next) {
  if (req.user && req.user._id) next();
  else {
    res.status(401);
    res.json({ message: 'UnAuthorized' });
  }
}

function checkTokenSetUser(req, res, next) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  let data;
  // Try authenticate with the access token
  if (accessToken) {
    try {
      data = jwt.verify(accessToken, config.accessToken);
      // eslint-disable-next-line no-empty
    } catch (_) {}
  }

  // If authentication above failed Try authenticate with the access token
  if (refreshToken && !data) {
    try {
      data = jwt.verify(refreshToken, config.refreshToken);
    } catch (_) {
      return next();
    }
  }

  // This is bad could be swapped for redis but it's fine
  const dbUser = User.findOne({ email: data.email }).exec();

  // Token has been invalidated
  if (!data || dbUser.tokenVersion !== data.tokenVersion) {
    return next();
  }

  // Re-issue tokens this will work like user will stay logged in until they
  // stop comming back for a week
  const tokens = auth.GetTokens(dbUser);
  res.cookie('access_token', tokens.accessToken);
  res.cookie('refresh_token', tokens.refresh_token);
  req.user = data;
  return next();
}

module.exports = {
  checkTokenSetUser,
  ensureLoggedIn
};
