const jwt = require('jsonwebtoken');
const Tokens = require('../lib/tokens');
const Crypto = require('../lib/crypto');
const config = require('../../../config');
const Auth = require('../lib/auth');

async function tokenIsValid(user, data, csrfToken) {
  return (
    data && user.tokenVersion === data.tokenVersion && Crypto.Compare(data.csrfToken, csrfToken)
  );
}

function getTokenData(token, secret) {
  try {
    const data = jwt.verify(token, secret);
    return data;
  } catch (_) {
    return null;
  }
}

module.exports = async function checkTokensSetUser(req, res, next) {
  const refreshToken = req.cookies.refresh_token;
  const csrfToken = req.header('x-csrf-token');
  // If you were authenticated by the access token just do nothing or there is
  // no crsf token
  if (req.user || !csrfToken) return next();
  // Try authenticate with the refresh token before refreshing tokens
  const data = getTokenData(refreshToken, config.tokens.refresh);
  if (data) {
    const user = await Auth.GetUser(data.email);
    // Token has been invalidated or the csrfTokens don't
    // match so just proceed without authentication.
    if (!tokenIsValid(user, data, csrfToken)) return next();

    // Re-issue tokens this will work like user will stay logged in until they
    // stop comming back for a week
    const tokens = Tokens.GetTokens(user);
    res
      .cookie('access_token', tokens.accessToken, config.accessTokenOptions)
      .cookie('refresh_token', tokens.refreshToken, config.refreshTokenOption);
    req.user = data;
  }

  return next();
};
