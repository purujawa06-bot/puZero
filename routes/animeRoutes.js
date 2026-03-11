const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

router.get('/', animeController.getAnimePage);
router.get('/search', animeController.searchAnime);
router.get('/filter', animeController.getAnimeFilter);
router.get('/schedule', animeController.getAnimeSchedule);
router.get('/filedon-stream', animeController.streamFiledon);
router.get('/detail/:path(*)', animeController.getAnimeDetail);
router.get('/stream/:path(*)', animeController.getAnimeStream);
router.post('/player', animeController.getStreamPlayer);

module.exports = router;
