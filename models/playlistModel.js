const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "user",
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