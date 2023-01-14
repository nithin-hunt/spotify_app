const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(user);
};

module.exports = validate;