const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/toolsController');
const multer = require('multer');

// Konfigurasi Multer untuk penyimpanan memori
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

router.get('/upscale', toolsController.getUpscalePage);
router.get('/dubbing', toolsController.getDubbingPage);

// Route untuk upload file sementara
router.post('/upload', upload.single('image'), toolsController.uploadToTmp);

module.exports = router;
