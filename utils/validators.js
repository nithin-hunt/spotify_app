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
        user_id: Joi.string(),
        description: Joi.string().required(),
        songs: Joi.array().items(Joi.string())
    });
    return schema.validate(playlist);
};

const validateSong = (song) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        artist: Joi.string().required(),
        song: Joi.string().required(),
        image: Joi.string(),
        duration: Joi.number().required()
    });
    return schema.validate(song);
};

const validateEmail = (userEmail) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    return schema.validate({email: userEmail});
};

const validatePassword = (userPassword) => {
    const schema = Joi.object({
        password: passwordComplexity().required(),
    });
    return schema.validate({password: userPassword});
};

module.exports = {validateUser, validatePlaylist, validateSong, validateEmail, validatePassword};