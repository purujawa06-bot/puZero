const express = require('express');
const router = express.Router();
const soundcloudController = require('../controllers/soundcloudController');

router.get('/', soundcloudController.getSoundCloudPage);

module.exports = router;
