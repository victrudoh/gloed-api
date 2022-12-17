// Dependencies
const Joi = require("@hapi/joi");

//  Validation
const signUpValidation = Joi.object({
    // firstName: Joi.string().min(2).required(),
    // lastName: Joi.string().min(2).required(),
    // userName: Joi.string().min(4).required(),
    fullname: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    // phone: Joi.string().min(11).required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().min(4),
    // media: Joi.string().required(),
});
const loginValidation = Joi.object({
    email: Joi.string().min(6).required().email(),
    // username: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
});

module.exports = {
    signUpValidation,
    loginValidation,
};