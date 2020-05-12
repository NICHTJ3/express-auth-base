const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { User } = require('../models');
const config = require('../../../config');

function GetTokens(user) {
  const csrfToken = uuid();
  const accessToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      tokenVersion: user.tokenVersion,
      csrfToken
    },
    config.tokens.access,
    {
      expiresIn: '4h'
    }
  );

  const refreshToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      tokenVersion: user.tokenVersion,
      csrfToken
    },
    config.tokens.refresh,
    {
      expiresIn: '7d'
    }
  );

  return { accessToken, refreshToken, csrfToken };
}

async function GetUser(email) {
  return User.findOne({ email }).exec();
}

async function EmailTaken(email) {
  return Boolean(await GetUser(email));
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function PasswordsMatch(password1, password2) {
  return bcrypt.compare(password1, password2);
}

async function AddUser(name, email, password) {
  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  return user.save();
}

module.exports = {
  AddUser,
  GetUser,
  GetTokens,
  PasswordsMatch,
  EmailTaken
};
