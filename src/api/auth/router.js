const express = require('express');
const auth = require('./auth');
const { validateBody } = require('../../middlewares');
const { SignupSchema, LoginSchema } = require('../../schemas');

const router = express.Router();
const { ensureLoggedIn } = require('../../middlewares');

const createValidationError = (message, type = ['general']) => ({
  type,
  message
});

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the auth endpoint' });
});

router.post('/signup', validateBody(SignupSchema), async (req, res) => {
  const { email: emailDirty, name, password } = req.body;
  const email = emailDirty.toLowerCase();

  // Check email is not already taken
  if (await auth.EmailTaken(req.email)) {
    return res.status(422).json({
      errors: [createValidationError('Email already taken', ['email'])]
    });
  }

  // Try signup user but responed with an error if it fails
  try {
    const tokens = await auth.Signup(name, email, password);
    res.cookie('access_token', tokens.accessToken);
    res.cookie('refresh_token', tokens.refreshToken);
    return res.json({
      message: 'Successfully authenticated'
    });
  } catch (e) {
    return res.status(500).json(createValidationError('There was an error creating your user'));
  }
});

router.post('/login', validateBody(LoginSchema), async (req, res) => {
  const { email: emailDirty, password } = req.body;

  const email = emailDirty.toLowerCase();

  // Try get user with the given email
  const user = await auth.GetUser(email);

  if (!user || !auth.PasswordsMatch(password, user.password)) {
    return res.status(400).json({
      errors: [createValidationError('Incorrect information')]
    });
  }

  const tokens = auth.GetTokens(user);

  res.cookie('access_token', tokens.accessToken);
  res.cookie('refresh_token', tokens.refreshToken);
  return res.json({
    message: 'Successfully authenticated'
  });
});

router.get('/user', ensureLoggedIn, (req, res) => res.json({
  data: { ...req.user }
}));

module.exports = router;
