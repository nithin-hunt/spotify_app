const router = require('express').Router();
const Song = require('../models/songModel');
const {validateSong} = require('../utils/validators');

// Get all songs
router.get("/", async(req,res) => {
    try {
        const fetchSongs = await fetch(`https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=india&api_key=50e64c2b34b804ba020864e65a1deb5c&format=json`)
        const songs = await fetchSongs.json();
        var songList =[]
        for (let i=0 ; i < songs.tracks.track.length; i++) {
            
            let getSong = {}
            getSong.song_id = songs.tracks.track[i].mbid;
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

            // const song = await Song({
            //     ...getSong
            // }).save();
        }
        res.status(200).json(songList);
    } catch(e) {
        return res.status(500).json({Error: e})
    }
})

module.exports = router;