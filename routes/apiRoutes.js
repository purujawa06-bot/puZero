const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Endpoint: POST /api/ai/tsundere
router.post('/ai/tsundere', aiController.tsundere);

module.exports = router;