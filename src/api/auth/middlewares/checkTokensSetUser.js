const jwt = require('jsonwebtoken');
const Tokens = require('../lib/tokens');
const config = require('../../../config');
const Auth = require('../lib/auth');

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

module.exports = async function checkTokensSetUser(req, res, next) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  const csrfToken = req.header('x-csrf-token');

  if (!csrfToken) return next();

  let data;
  // Try authenticate with the access token if it works just continue
  data = getTokenData(accessToken, config.tokens.access);
  if (data) {
    if (data.csrfToken !== csrfToken) return next();
    req.user = data;
    return next();
  }

  // If authentication above failed Try authenticate with the refresh token
  data = getTokenData(refreshToken, config.tokens.refresh);
  if (!data) return next();

  const user = await Auth.GetUser(data.email);

  // Token has been invalidated or the csrfToken doesn't match so just proceed without it
  if (!tokenIsValid(user, data, csrfToken)) return next();

  // Re-issue tokens this will work like user will stay logged in until they
  // stop comming back for a week
  const tokens = Tokens.GetTokens(user);
  res
    .cookie('access_token', tokens.accessToken, config.accessTokenOptions)
    .cookie('refresh_token', tokens.refreshToken, config.refreshTokenOption);

  req.user = data;
  return next();
};
