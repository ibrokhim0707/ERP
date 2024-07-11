const Joi = require("joi");

exports.createGuideSchema = Joi.object({
  title: Joi.string().required().min(4).max(50).trim(),
  content: Joi.string().required().min(4).max(1000).trim(),
  notify: Joi.boolean().required(),
});

exports.editGuideSchema = Joi.object({
  title: Joi.string().min(4).max(50).trim(),
  content: Joi.string().min(4).max(1000).trim(),
  notify: Joi.boolean(),
});
