const Auth = require('../lib/auth');

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

