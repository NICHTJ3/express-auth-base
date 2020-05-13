const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const config = require('../../../config');
const Crypto = require('./crypto');

async function GetSafeUserPayload(user, csrfToken) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    tokenVersion: user.tokenVersion,
    csrfToken: await Crypto.Hash(csrfToken)
  };
}

function GetToken(payload, secret, expiry) {
  return jwt.sign(payload, secret, {
    expiresIn: expiry
  });
}

exports.GetTokens = async function GetTokens(user, csrfToken = uuid()) {
  const payload = await GetSafeUserPayload(user, csrfToken);
  const accessToken = GetToken(payload, config.tokens.access, '4h');
  const refreshToken = GetToken(payload, config.tokens.refresh, '7d');
  return { accessToken, refreshToken, csrfToken };
};
