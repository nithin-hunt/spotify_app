const mongoose = require('mongoose');
const Song = require('../models/songModel')
const Joi = require('joi');

const isSongExist = async (req,res,next) => {
    try {
        const schema = Joi.object({
            song_id: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.song_id)) {
            return res.status(404).json("Invalid Song ID");
        }

        const song = await Song.findById(req.body.song_id);
        if(!song) {
            return res.status(404).json("Song not found");
        }
        
        next();
    } catch (e) {
        return res.status(500).json({Error: e});
    }
}

module.exports = isSongExist;