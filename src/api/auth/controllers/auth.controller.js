const Auth = require('../lib/auth');
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
    const tokens = Auth.GetTokens(user);
    return res
      .cookie('access_token', tokens.accessToken, config.accessTokenOptions)
      .cookie('refresh_token', tokens.refreshToken, config.refreshTokenOptions)
      .json({
        message: 'Successfully authenticated',
        csrfToken: tokens.csrfToken
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

  const tokens = Auth.GetTokens(user);

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
