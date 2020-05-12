const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const config = require('../../../config');

function GetSafeUserPayload(user, csrfToken) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    tokenVersion: user.tokenVersion,
    csrfToken
  };
}

function GetToken(payload, secret, expiry) {
  return jwt.sign(payload, secret, {
    expiresIn: expiry
  });
}

exports.GetTokens = function GetTokens(user) {
  const csrfToken = uuid();
  const accessToken = GetToken(GetSafeUserPayload(user, csrfToken), config.tokens.access, '4h');
  const refreshToken = GetToken(GetSafeUserPayload(user, csrfToken), config.tokens.refresh, '7d');
  return { accessToken, refreshToken, csrfToken };
};
