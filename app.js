require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./config/db');

const userRoutes = require('./routes/users');
const forgotPasswordRoutes = require('./routes/forgotPassword');
const friendRoutes = require('./routes/friends');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/users", userRoutes);
app.use("/api/users/forgot-password", forgotPasswordRoutes);
app.use("/api/users/friends", friendRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
    } catch (e) {
        console.log(e)
    }
};

start();