const express = require('express');
const AuthController = require('./controllers/auth.controller');
const PasswordController = require('./controllers/passwords.controller');
const RequestSchemas = require('./schemas');

const router = express.Router();
const { ensureLoggedIn } = require('./middlewares');
const { validateBody } = require('../middlewares');

router.get('/', AuthController.home);

router.post('/signup', validateBody(RequestSchemas.SignupSchema), AuthController.signup);

router.post('/login', validateBody(RequestSchemas.LoginSchema), AuthController.login);

router.get('/user', ensureLoggedIn, AuthController.getUserCurrentUser);

router.get('/confirm/:token', AuthController.confirmEmail);

router.post(
  '/password/changePassword',
  [validateBody(RequestSchemas.ChangePassword), ensureLoggedIn],
  PasswordController.changePassword
);

module.exports = router;
