const jwt = require('jsonwebtoken');
const Auth = require('../lib/auth');
const Tokens = require('../lib/tokens');
const Mailer = require('../lib/mailer');
const config = require('../../../config');

const createValidationError = (message, type = ['general']) => ({
  type,
  message
});

exports.home = (req, res) => {
  res.json({ message: 'Welcome to the auth endpoint' });
};

exports.signup = async (req, res) => {
  const { email: emailDirty, name, password } = req.body;
  const email = emailDirty.toLowerCase();

  // Check email is not already taken
  if (await Auth.EmailTaken(email)) {
    return res.status(422).json({
      errors: [createValidationError('Email already taken', ['email'])]
    });
  }

  // Try signup user but responed with an error if it fails
  try {
    const user = await Auth.AddUser(name, email, password);
    const mailer = new Mailer(user.email);
    mailer.sendConfirmationEmail();
    return res.json({
      message: 'Successfully signed up now go confirm your email '
    });
  } catch (e) {
    return res.status(500).json(createValidationError('There was an error creating your user'));
  }
};

exports.login = async (req, res) => {
  const { email: emailDirty, password } = req.body;

  const email = emailDirty.toLowerCase();

  // Try get user with the given email
  const user = await Auth.GetUser(email);
  if (!user || !(await Auth.PasswordsMatch(password, user.password))) {
    return res.status(400).json({
      errors: [createValidationError('Incorrect information')]
    });
  }

  if (!user.confirmed) {
    return res.status(400).json({
      errors: [createValidationError('Please confirm your email')]
    });
  }

  const tokens = Tokens.GetTokens(user);

  return res
    .cookie('access_token', tokens.accessToken, config.accessTokenOptions)
    .cookie('refresh_token', tokens.refreshToken, config.refreshTokenOptions)
    .json({
      message: 'Successfully authenticated',
      csrfToken: tokens.csrfToken
    });
};

exports.getUserCurrentUser = (req, res) => res.json({
  data: { ...req.user }
});

exports.confirmEmail = async (req, res) => {
  try {
    const { email } = jwt.verify(req.params.token, config.tokens.email);
    const user = await Auth.GetUser(email);
    user.confirmed = true;
    await user.save();
  } catch (error) {
    return res.status(400).json({
      errors: [createValidationError('There was an error verifying your email')]
    });
  }

  return res.redirect(`${config.frontendUrl}/login`);
};
