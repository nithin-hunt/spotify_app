const router = require('express').Router();
const Playlist = require('../models/playlistModel');
const {validatePlaylist} = require('../utils/validators');
const User = require('../models/userModel');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isValidObjectId = require('../middlewares/isValidObjectId');

// Create playlist
router.post("/", isAuthenticated, async (req,res) => {
    try {
        const {error} = validatePlaylist(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message});
        }
        
        const user = await User.findById(req.user._id);
        const playlist = await Playlist({
            ...req.body,
            user_id : user._id
        }).save();

        user.playlists.push(playlist._id);
        await user.save();

        res.status(201).json(playlist);
    } catch (e) {
        console.log(e);
        return res.status(500).json({Error: e});
    }
});

// Get User playlists
router.get('/', isAuthenticated, async(req,res) => {
    try {
        const user = await User.findById(req.user._id);
        const playlists = await Playlist.find({_id: user.playlists});
        res.status(200).json(playlists);
    } catch(e) {
        return res.status(500).json({Error: e});
    }
})

// Get User playlists by Id
router.get('/:id', [isValidObjectId,isAuthenticated], async(req,res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if(!playlist) {
            return res.status(404).json("Playlist not found");
        }

        const user = await User.find({playlists: req.params.id});
        const currentUser = await User.findById(req.user._id);
        if(!(user[0].email === currentUser.email)) {
            return res.status(404).json("This playlist cannot be accessed by this user");
        }

        res.status(200).json(playlist);
    } catch (e) {
        console.log(e);
        return res.status(500).json({Error: e});
    }
})


module.exports = router;
