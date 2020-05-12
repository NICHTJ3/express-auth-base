const express = require('express');
const { validateBody } = require('../../middlewares');
const AuthController = require('./controller');
const { SignupSchema, LoginSchema } = require('./schemas');

const router = express.Router();
const { ensureLoggedIn } = require('../../middlewares');

router.get('/', AuthController.home);

router.post('/signup', validateBody(SignupSchema), AuthController.signup);

router.post('/login', validateBody(LoginSchema), AuthController.login);

router.get('/user', ensureLoggedIn, AuthController.getUserCurrentUser);

module.exports = router;
