const mongoose = require('mongoose');
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "user",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    songs: {
        type: Array,
        default: []
    }
});

const Playlist = mongoose.model("playlist", playlistSchema);

module.exports = Playlist;