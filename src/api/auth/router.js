const express = require('express');
const AuthController = require('./controllers/authController');
const RequestSchemas = require('./schemas');

const router = express.Router();
const { ensureLoggedIn, validateBody } = require('../../middlewares');

router.get('/', AuthController.home);

router.post('/signup', validateBody(RequestSchemas.SignupSchema), AuthController.signup);

router.post('/login', validateBody(RequestSchemas.LoginSchema), AuthController.login);

router.get('/user', ensureLoggedIn, AuthController.getUserCurrentUser);

module.exports = router;
