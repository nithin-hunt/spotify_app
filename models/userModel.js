const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must provide name"],
    },
    email: {
        type: String,
        required: [true, "Must provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Must provide password"],
    },
    playlists: {
        type: [String],
        default: []
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;