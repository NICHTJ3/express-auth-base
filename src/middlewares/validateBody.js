const Joi = require('@hapi/joi');

const createValidationError = (message, type = ['general']) => ({
  type,
  message
});

const validateBody = (schema) => {
  // Check schema is valid
  const validSchema = schema instanceof Joi.constructor;
  if (!validSchema) throw Error('Schema supplied was not valid');
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true
    });

    if (error) {
      return res.status(422).json({
        errors: error.details.map((e) => createValidationError(e.message, e.path))
      });
    }
    return next();
  };
};

module.exports = validateBody;
