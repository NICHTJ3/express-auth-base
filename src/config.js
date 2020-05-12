const Joi = require('@hapi/joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(5000),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  MONGO_URI: Joi.string()
    .required()
    .description('Mongo DB host url'),
  TOKEN_SECRET_ACCESS: Joi.string()
    .required()
    .description('The secret used to encrypt users access data'),
  TOKEN_SECRET_REFRESH: Joi.string()
    .required()
    .description('The secret used to encrypt users refresh token'),
  TOKEN_SECRET_EMAIL: Joi.string()
    .required()
    .description('The secret used to encrypt users email token'),
  TOKEN_SECRET_PASSWORD_RESET: Joi.string()
    .required()
    .description('The secret used to encrypt users password reset token'),
  GMAIL_USER: Joi.string()
    .required()
    .description('The email for the account used to send confirmation emails'),
  GMAIL_CLIENT_ID: Joi.string()
    .required()
    .description('The client id for the google account used to send confirmation emails'),
  GMAIL_CLIENT_SECRET: Joi.string()
    .required()
    .description('The client secret for the google account used to send confirmation emails'),
  GMAIL_REFRESH_TOKEN: Joi.string()
    .required()
    .description('The refresh token for the google account used to send confirmation emails')
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  mongooseURI: envVars.MONGO_URI,
  tokens: {
    refresh: envVars.TOKEN_SECRET_ACCESS,
    access: envVars.TOKEN_SECRET_REFRESH,
    email: envVars.TOKEN_SECRET_EMAIL,
    passwordReset: envVars.TOKEN_SECRET_PASSWORD_RESET
  },
  gmail: {
    user: envVars.GMAIL_USER,
    clientId: envVars.GMAIL_CLIENT_ID,
    clientSecret: envVars.GMAIL_CLIENT_SECRET,
    refreshToken: envVars.GMAIL_REFRESH_TOKEN
  },
  accessTokenOptions: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 4 // Expire in 4 hours
  },
  refreshTokenOptions: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // Expire in 7 days
  }
};

module.exports = config;
