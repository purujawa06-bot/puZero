const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/', aiController.getChatPage);
router.get('/tsundere', aiController.getTsunderePage);
router.post('/tsundere', aiController.tsundere);

module.exports = router;