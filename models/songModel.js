const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
	song_id: { type: String},
    name: { type: String, required: true },
	artist: { type: String, required: true },
	song: { type: String, required: true },
	image: { type: String},
	duration: { type: String, required: true },
});

const Song = mongoose.model("song", songSchema);

module.exports = Song;