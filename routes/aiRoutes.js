const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/', aiController.getChatPage);
router.post('/chat', aiController.chatResponse);

module.exports = router;
