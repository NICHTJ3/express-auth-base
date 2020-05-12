const bcrypt = require('bcrypt');
const { User } = require('../models');

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

async function UpdatePassword(email, newPassword) {
  const user = await GetUser(email);
  user.password = await hashPassword(newPassword);
  return user.save();
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
  PasswordsMatch,
  UpdatePassword,
  EmailTaken
};
