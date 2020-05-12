const jwt = require('jsonwebtoken');
const config = require('../../../config');
const Auth = require('../lib/auth');
const Mailer = require('../lib/mailer');

const createValidationError = (message, type = ['general']) => ({
  type,
  message
});

exports.home = (req, res) => {
  res.json({ message: 'Welcome to the password endpoint' });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Check old password was correc
  const user = await Auth.GetUser(req.user.email);
  if (!(await Auth.PasswordsMatch(oldPassword, user.password))) {
    return res.status(400).json({
      errors: [createValidationError('Old password did not match', ['oldPassword'])]
    });
  }

  try {
    await Auth.UpdatePassword(req.user.email, newPassword);
    return res.json({
      message: 'Successfully updated your password'
    });
  } catch (_) {
    return res.status(500).json(createValidationError('There was an error updating your password'));
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Auth.GetUser(email);
  if (!user) {
    return res.status(422).json({
      errors: [createValidationError('No user with that email exists', ['email'])]
    });
  }

  const mailer = new Mailer(user.email);
  mailer.sendPasswordResetEmail();
  return res.json({
    message: 'Successfully sent a request to reset password now go check your email '
  });
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const { email } = jwt.verify(req.params.token, config.tokens.passwordReset);
    await Auth.UpdatePassword(email, newPassword);
  } catch (error) {
    return res.status(400).json({
      errors: [createValidationError('There was an error resetting your password')]
    });
  }
  return res.redirect('http://localhost:3000/login');
};
