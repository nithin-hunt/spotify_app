const mongoose = require('mongoose');

const isValidObjectId = (req,res,next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: "Invalid Playlist ID"});
    }
    next();
};

module.exports = isValidObjectId;