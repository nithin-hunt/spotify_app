const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
	artist: { type: String, required: true },
	song: { type: String, required: true },
	image: { type: String, required: true },
	duration: { type: String, required: true },
});

const Song = mongoose.model("song", songSchema);

module.exports = Song;