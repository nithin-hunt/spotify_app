const router = require('express').Router();
const Playlist = require('../models/playlistModel');
const {validatePlaylist} = require('../utils/validators');
const User = require('../models/userModel');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isPlaylistExist = require('../middlewares/isPlaylistExist');
const isUserOwnPlaylist = require('../middlewares/isUserOwnPlaylist');

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
        return res.status(500).json({Error: e});
    }
});

// Get playlists
router.get('/', isAuthenticated, async(req,res) => {
    try {
        const user = await User.findById(req.user._id);
        const playlists = await Playlist.find({_id: user.playlists});
        res.status(200).json(playlists);
    } catch(e) {
        return res.status(500).json({Error: e});
    }
})

// Get playlists by Id
router.get('/:id', [isAuthenticated, isPlaylistExist, isUserOwnPlaylist], async(req,res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        res.status(200).json(playlist);
    } catch (e) {
        return res.status(500).json({Error: e});
    }
})

// Update playlist by Id
router.put('/:id', [isAuthenticated, isPlaylistExist, isUserOwnPlaylist], async(req,res) => {
    try {
        const {error} = validatePlaylist(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message});
        }

        const playlist = await Playlist.findById(req.params.id);
        playlist.name = req.body.name;
        playlist.description = req.body.description;
        await playlist.save();

        res.status(200).json({ message: "Playlist updated successfully" , updatedPlaylist : playlist})
    } catch(e) {
        return res.status(500).json({Error: e});
    }
})

// Delete playlist by Id
router.delete('/:id', [isAuthenticated, isPlaylistExist, isUserOwnPlaylist] ,async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        const index = user.playlists.indexOf(req.params.id);
        user.playlists.splice(index, 1);
        await user.save();
        
        const playlist = await Playlist.findById(req.params.id);
        await playlist.remove();
        
        return res.status(200).json("Playlist removed from library");
    } catch (e) {
        return res.status(500).json({Error: e});
    }
})

module.exports = router;
