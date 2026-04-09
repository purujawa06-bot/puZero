const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Jadikan AI Chat sebagai halaman utama
router.get('/', aiController.getChatPage);

module.exports = router;