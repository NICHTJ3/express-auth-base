const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const config = require('../../config');

function GetTokens(user) {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      tokenVersion: user.tokenVersion
    },
    config.accessToken,
    {
      expiresIn: '4h'
    }
  );

  const refreshToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      tokenVersion: user.tokenVersion
    },
    config.refreshToken,
    {
      expiresIn: '7d'
    }
  );

  return { accessToken, refreshToken };
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

async function Signup(name, email, password) {
  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  const result = await user.save();

  // Tokenize data
  // TODO: Make into a function
  // TODO: Extract expiry values to the config
  const tokens = GetTokens(result);
  return tokens;
}

module.exports = {
  Signup,
  GetUser,
  GetTokens,
  PasswordsMatch,
  EmailTaken
};
