const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

module.exports = class Mailer {
  constructor(email) {
    this.email = email;
    this.transport = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'Oauth2',
        user: config.gmail.user,
        clientId: config.gmail.clientId,
        clientSecret: config.gmail.clientSecret,
        refreshToken: config.gmail.refreshToken
      }
    });
    this.transport.verify();
  }

  sendConfirmationEmail() {
    jwt.sign(
      {
        email: this.email
      },
      config.tokens.email,
      { expiresIn: '1d' },
      (err, emailToken) => {
        const url = `http://localhost:${config.port}/api/v1/auth/confirm/${emailToken}`;
        this.transport.sendMail({
          to: this.email,
          subject: 'Confirm email',
          html: `Please click this link to confirm your email: <a href="${url}">Confirm</a> `
        });
      }
    );
  }

  sendPasswordResetEmail() {
    jwt.sign(
      {
        email: this.email
      },
      config.tokens.passwordReset,
      { expiresIn: '1d' },
      (err, emailToken) => {
        const url = `${config.frontendUrl}/resetPassword/${emailToken}`;
        this.transport.sendMail({
          to: this.email,
          subject: 'Forgot your password',
          html: `Please click this link to reset your password: <a href="${url}">Reset</a> `
        });
      }
    );
  }
};
