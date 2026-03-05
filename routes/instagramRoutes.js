const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

router.get('/', instagramController.getInstagram);
router.post('/download', instagramController.downloadMedia);

module.exports = router;
