const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const config = require("./config");
const artists = require('./app/artists');
const albums = require('./app/albums');
const tracks = require('./app/tracks');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const run = async () => {
    await mongoose.connect('mongodb://localhost/music', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    app.use('/artists', artists);
    app.use('/albums', albums);
    app.use('/tracks', tracks);

    app.listen(config.port, () => {
        console.log(`HTTP Server started on ${config.port} port!`);
    })
};
run().catch(e => {
    console.error(e)
});