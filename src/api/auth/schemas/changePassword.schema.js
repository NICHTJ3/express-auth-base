const Joi = require('@hapi/joi');

module.exports = Joi.object({
  oldPassword: Joi.string()
    .required()
    .min(8),
  newPassword: Joi.string()
    .required()
    .min(8),
  confirmNewPassword: Joi.valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm Password must match new Password',
      'any.required': 'Confirm Password is required'
    })
});
