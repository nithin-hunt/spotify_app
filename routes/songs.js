const router = require('express').Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const Song = require('../models/songModel');
const {validateSong} = require('../utils/validators');

// Get all songs
router.get("/", isAuthenticated, async(req,res) => {
    try {
        const fetchSongs = await fetch(`https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=india&api_key=${process.env.LASTFM_API_KEY}&format=json`)
        const songs = await fetchSongs.json();
        var songList =[]
        for (let i in  songs.tracks.track) {
            
            let getSong = {}
            getSong.id = songs.tracks.track[i].mbid;
            getSong.name = songs.tracks.track[i].name;
            getSong.artist = songs.tracks.track[i].artist.name;
            getSong.song = songs.tracks.track[i].url;
            getSong.image = songs.tracks.track[i].image[0]['#text'];
            getSong.duration = songs.tracks.track[i].duration;

            songList.push(getSong);
            // const {error} = validateSong(getSong);
            //     if (error) {
            //         return res.status(400).json({ message: error.details[0].message});
            //     }
                
            //     const song = await Song({
            //         ...getSong
            //     }).save();
            }
            res.status(200).json(songList);
        } catch(e) {
        return res.status(400).json({Error: e.message})
    }
});

        
// Search song
router.get("/search", isAuthenticated, async (req, res) => {
    try {
        const songs = await Song.find({
            $or: [
            { name: { $regex: `${req.query.name}`, $options: "i" } },
            { artist: { $regex : `${req.query.artist}`, $options: "i"}},
            ], });
        res.status(200).send(songs);
    } catch(e) {
        return res.status(500).json({Error: e});
        }

});

// Get song by Id
router.get("/:id", isAuthenticated, async (req,res) => {
    try {
        const fetchSong = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${process.env.LASTFM_API_KEY}&mbid=${req.params.id}&format=json`)
        const song = await fetchSong.json();
        
        let getSong= {};
        getSong.id = song.track.mbid;
        getSong.name = song.track.name;
        getSong.album = song.track.album.title;
        getSong.artist = song.track.artist.name;
        getSong.song = song.track.url;
        getSong.image = song.track.album.image[0]['#text'];
        getSong.duration = song.track.duration;
        
        return res.status(200).json(getSong);
    } catch (e) {
        return res.status(400).json({Error: e});
    }

})

module.exports = router;