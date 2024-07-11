const Joi = require("joi");

exports.createTodosSchema = Joi.object({
  user_id: Joi.string().required(),
  guide_id: Joi.string().required(),
});
