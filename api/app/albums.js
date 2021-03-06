const express = require('express');
const router = express.Router();
const multer = require('multer');
const nanoid = require('nanoid');
const path = require('path');

const config =require('../config');
const Albums = require('../model/Album');

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, config.uploadPath);
   },
   filename: (req, file, cb) => {
      cb(null, nanoid() + path.extname(file.originalname));
   }
});
const upload = multer({storage});

router.get('/', async (req, res) => {
    let params = null;

    if (req.query.artist) {
        params = {artist: req.query.artist}
    }

    try {
        const albums = await Albums.find(params);
        res.send(albums)
    } catch (e) {
        res.status(404).send({message: 'Not found'});
    }

});

router.get('/:id', async (req, res) => {

    try {
        const albums = await Albums.findById(req.params.id).populate('artist');
        console.log('id')
        res.send(albums)
    } catch (e) {
        res.status(404).send({message: 'Not found'});
    }

});

router.post('/',upload.single('image'), async (req, res) => {
    console.log('album ok')
    const albumData = req.body;

    if (req.file) {
        albumData.image = req.file.filename;
    }
    const album = new Albums(albumData);

    try {

        await album.save();
        return res.send({id: album._id})

    } catch (e) {

        return res.status(404).send(e);
    }

});

module.exports = router;