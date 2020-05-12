const Joi = require('@hapi/joi');

module.exports = Joi.object({
  email: Joi.string()
    .email()
    .required()
});
