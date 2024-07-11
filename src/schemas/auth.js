const Joi = require("joi");

exports.loginSchema = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string().min(4).max(8).required(),
});
