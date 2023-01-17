const router = require('express').Router();
const isAuthenticated =require('../middlewares/isAuthenticated');
const {validateEmail} = require('../utils/validators');
const User = require('../models/userModel');

router.post("/", [isAuthenticated],  async(req,res) => {
    try {
        const email = req.body.email;
        const {error} = validateEmail(email);
        if(error){
            return res.status(400).json({message: error.details[0].message});
        }

        const user = await User.findById(req.user._id);
        const friend = await User.findOne({email: req.body.email});
        if (!friend) {
            return res.status(404).send("Friend profile not found");
        }

        if(user._id.equals(friend._id)) {
            return res.status(400).json("User can't add self as friend");
        }

        const index = user.friends.indexOf(friend._id);
        if(index > -1) {
            return res.status(400).json("Friend already added");
        }

        await user.friends.push(friend._id);
        await user.save();

        res.status(200).json({message: "Friend added successfuly", user: user});

    } catch(e) {
        return res.status(500).json({Error: e.message});
    }
});

module.exports = router;