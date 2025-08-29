const Joi = require('joi');

const skillSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('').optional(),
});

module.exports = { skillSchema };