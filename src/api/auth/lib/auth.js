const Crypto = require('./crypto');
const { User } = require('../models');

async function GetUser(email) {
  return User.findOne({ email }).exec();
}

async function EmailTaken(email) {
  return Boolean(await GetUser(email));
}

async function PasswordsMatch(password1, password2) {
  return Crypto.Compare(password1, password2);
}

async function UpdatePassword(email, newPassword) {
  const user = await GetUser(email);
  user.password = await Crypto.Hash(newPassword);
  return user.save();
}

async function AddUser(name, email, password) {
  const hashedPassword = await Crypto.Hash(password);

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
  PasswordsMatch,
  UpdatePassword,
  EmailTaken
};
