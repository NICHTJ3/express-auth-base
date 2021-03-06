const { Schema, model } = require('mongoose');

const User = new Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 255
  },
  email: {
    type: String,
    required: true
  },
  // This is used to invalidate user tokens
  tokenVersion: {
    type: Number,
    default: 1
  },
  // This is used to check the email has been validated
  confirmed: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024
  }
});

User.path('email').validate((value) => {
  const emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(value);
}, 'Invalid email');

module.exports = model('user', User);
