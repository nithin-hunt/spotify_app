const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(user);
};

const validatePlaylist = (playlist) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        user: Joi.string().required(),
        description: Joi.string().allow(""),
        songs: Joi.string().items(Joi.string())
    });
    return schema.validate(playlist);
};

module.exports = {validateUser, validatePlaylist};