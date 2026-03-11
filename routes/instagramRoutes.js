const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

router.get('/', instagramController.getInstagram);

module.exports = router;
