const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

router.get('/', animeController.getAnimePage);
router.get('/detail', animeController.getAnimeDetail);

module.exports = router;
