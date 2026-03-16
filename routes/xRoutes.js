const express = require('express');
const router = express.Router();
const xController = require('../controllers/xController');

router.get('/', xController.getXDownloader);
router.post('/', xController.postXDownloader);

module.exports = router;