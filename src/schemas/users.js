const Joi = require("joi");

exports.createUsersSchema = Joi.object({
  firstname: Joi.string().required().min(3).max(20).trim(),
  lastName: Joi.string().required().min(3).max(20).trim(),
  username: Joi.string().required().min(4).max(20).trim(),
  age: Joi.number().required().integer().min(1).max(99),
  role: Joi.string().required().trim(),
  password: Joi.string().required().min(4).max(8).trim(),
});


exports.editUserSchema = Joi.object({
  firstname: Joi.string().min(3).max(20).trim(),
  lastName: Joi.string().min(3).max(20).trim(),
  username: Joi.string().min(4).max(20).trim(),
  age: Joi.number().integer().min(1).max(99),
  role: Joi.string().trim(),
});