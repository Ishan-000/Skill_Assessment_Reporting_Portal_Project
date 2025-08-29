const Joi = require('joi');

const questionSchema = Joi.object({
  skill_id: Joi.number().integer().positive().required(),
  question_text: Joi.string().min(10).required(),
  options: Joi.array().items(Joi.string()).min(2).required(),
  correct_option_index: Joi.number().integer().min(0).required()
    .custom((value, helpers) => {
      const { options } = helpers.state.ancestors[0];
      if (value >= options.length) {
        return helpers.error('any.invalid');
      }
      return value;
    }).messages({
      'any.invalid': 'Correct option index must be within the bounds of the options array'
    }),
});

module.exports = { questionSchema };