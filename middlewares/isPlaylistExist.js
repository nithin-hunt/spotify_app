const mongoose = require('mongoose');
const Playlist = require('../models/playlistModel')

const isPlaylistExist = async (req,res,next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json("Invalid Playlist ID");
        }

        const playlist = await Playlist.findById(req.params.id);
        if(!playlist) {
            return res.status(404).json("Playlist not found");
        }
        
        next();
    } catch (e) {
        return res.status(500).json({Error: e});
    }
}

module.exports = isPlaylistExist;