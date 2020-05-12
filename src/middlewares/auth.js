const jwt = require('jsonwebtoken');
const config = require('../config');
const auth = require('../api/auth/auth');

function ensureLoggedIn(req, res, next) {
  if (req.user && req.user._id) return next();
  return res.status(401).json({ message: 'UnAuthorized' });
}

function getTokenData(token, secret) {
  try {
    const data = jwt.verify(token, secret);
    return data;
  } catch (_) {
    return null;
  }
}

async function tokenIsValid(user, data, csrfToken) {
  return data && user.tokenVersion === data.tokenVersion && data.csrfToken === csrfToken;
}

async function checkTokenSetUser(req, res, next) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  const csrfToken = req.header('x-csrf-token');

  if (!csrfToken) return next();

  let data;
  // Try authenticate with the access token if it works just continue
  data = getTokenData(accessToken, config.accessToken);
  if (data) {
    if (data.csrfToken !== csrfToken) return next();
    req.user = data;
    return next();
  }

  // If authentication above failed Try authenticate with the refresh token
  data = getTokenData(refreshToken, config.refreshToken);
  if (!data) return next();

  const user = await auth.GetUser(data.email);

  // Token has been invalidated or the csrfToken doesn't match so just proceed without it
  if (!tokenIsValid(user, data, csrfToken)) return next();

  // Re-issue tokens this will work like user will stay logged in until they
  // stop comming back for a week
  const tokens = auth.GetTokens(user);
  res
    .cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 4 // Expire in 4 hours
    })
    .cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // Expire in 7 days
    });

  req.user = data;
  return next();
}

module.exports = {
  checkTokenSetUser,
  ensureLoggedIn
};
