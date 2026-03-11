const express = require('express');
const router = express.Router();
const fastUpdateController = require('../controllers/fastUpdateController');

// Route untuk menampilkan halaman web Fast Update
router.get('/', fastUpdateController.getFastUpdatePage);

// Route untuk mendownload Context project
router.get('/download', fastUpdateController.downloadContext);

// Route untuk mengeksekusi kode dari AI.
// Kita gunakan express.text() karena request body berupa text Base64 mentah
router.post('/update', express.text({ type: 'text/plain', limit: '10mb' }), fastUpdateController.applyUpdate);

module.exports = router;