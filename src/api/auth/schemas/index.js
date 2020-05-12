const SignupSchema = require('./signup.schema');
const LoginSchema = require('./login.schema');
const ForgotPassword = require('./forgotPassword.schema');
const ChangePassword = require('./changePassword.schema');
const ResetPassword = require('./resetPassword.schema');

module.exports = {
  LoginSchema,
  SignupSchema,
  ForgotPassword,
  ResetPassword,
  ChangePassword
};
