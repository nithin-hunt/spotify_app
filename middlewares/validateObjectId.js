const mongoose = require('mongoose');

const validateObjectId = (req,res,next) => {
    if (!mongoose.Types.ObjectId.isValid(re.params.id)) {
        return res.status(404).json({ message: "Invalid ID"});
    }
    next();
};

module.exports = validateObjectId;