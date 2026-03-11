const express = require('express');
const router = express.Router();
const tiktokController = require('../controllers/tiktokController');

router.get('/', tiktokController.getTiktokPage);

module.exports = router;
