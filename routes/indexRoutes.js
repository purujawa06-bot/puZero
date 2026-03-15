const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getHome);
router.get('/category', indexController.getCategory);
router.get('/features', indexController.getFeatures);
router.get('/tos', indexController.getTOS);
router.get('/privacy', indexController.getPrivacy);
router.get('/history', indexController.getHistory);

module.exports = router;