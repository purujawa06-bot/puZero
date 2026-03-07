const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');

router.get('/', streamController.proxyStream);

module.exports = router;
