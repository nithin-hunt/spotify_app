const User = require('../models/userModel');
const Playlist = require('../models/playlistModel');


const isUserOwnPlaylist = async(req,res,next) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        const user = await User.findById(req.user._id);
        if (!user._id.equals(playlist.user_id)) {
            return res.status(403).json("User don't have access to this playlist");
        }

        next();

    } catch(e) {
        return res.status(500).json({Error: e})
    }
}

module.exports = isUserOwnPlaylist;