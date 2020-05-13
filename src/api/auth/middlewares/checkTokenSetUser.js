const jwt = require('jsonwebtoken');
const config = require('../../../config');
const Crypto = require('../lib/crypto');

function getTokenData(token, secret) {
  try {
    const data = jwt.verify(token, secret);
    return data;
  } catch (_) {
    return null;
  }
}

module.exports = async function checkTokensSetUser(req, res, next) {
  const accessToken = req.cookies.access_token;
  const csrfToken = req.header('x-csrf-token');
  // do nothing if there isno crsf token
  if (!csrfToken) return next();

  // Try authenticate with the access token
  const data = getTokenData(accessToken, config.tokens.access);
  if (data && (await Crypto.Compare(csrfToken, data.csrfToken))) {
    req.user = data;
  }
  return next();
};
