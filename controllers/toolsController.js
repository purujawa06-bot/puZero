exports.getUpscalePage = (req, res) => {
    const data = {
        title: 'PuZero | AI Image Upscale',
        page: 'pages/upscale'
    };

    if (req.headers['hx-request']) {
        res.render('pages/upscale', data);
    } else {
        res.render('layout', data);
    }
};

exports.uploadToTmp = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
        }

        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('file', blob, req.file.originalname);

        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            // Mengubah URL view menjadi URL download langsung untuk API
            const downloadUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            return res.json({ success: true, url: downloadUrl });
        } else {
            return res.status(500).json({ success: false, message: 'Gagal mengupload ke server temporary' });
        }
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
