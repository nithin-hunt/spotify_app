require('dotenv').config();
const express = require('express');
const app = express();

const PORT = proces.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));