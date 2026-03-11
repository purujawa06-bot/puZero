const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/toolsController');
const multer = require('multer');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/upscale', toolsController.getUpscalePage);
router.get('/dubbing', toolsController.getDubbingPage);
router.get('/ghibli', toolsController.getGhibliPage);

router.post('/upload', upload.single('image'), toolsController.uploadToTmp);

module.exports = router;
