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

module.exports = {validateUser, validatePlaylist, validateSong};