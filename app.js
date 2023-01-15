require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./config/db');

const userRoutes = require('./routes/users');
const playlistRoutes = require('./routes/playlists');

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users/", userRoutes);
app.use("/api/playlists/", playlistRoutes);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
    } catch (e) {
        console.log(e)
    }
};

start();