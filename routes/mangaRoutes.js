const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');

router.get('/', mangaController.getMangaHome);
router.get('/popular', mangaController.getMangaPopular);
router.get('/search', mangaController.searchManga);
router.get('/detail', mangaController.getMangaDetail);
router.get('/read', mangaController.readManga);

module.exports = router;