const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getHome);
router.get('/category', indexController.getCategory);

module.exports = router;
