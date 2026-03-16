const axios = require('axios');

exports.getXDownloader = (req, res) => {
    res.render('pages/x-downloader', {
        title: 'X/Twitter Video Downloader',
        result: null,
        error: null
    });
};

exports.postXDownloader = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.render('pages/x-downloader', {
            title: 'X/Twitter Video Downloader',
            result: null,
            error: 'URL tidak boleh kosong!'
        });
    }

    try {
        const response = await axios.post('https://puruboy-api.vercel.app/api/downloader/x', { url });
        const data = response.data;

        if (data.success && data.result && data.result.success) {
            res.render('pages/x-downloader', {
                title: 'X/Twitter Video Downloader',
                result: data.result,
                error: null
            });
        } else {
            res.render('pages/x-downloader', {
                title: 'X/Twitter Video Downloader',
                result: null,
                error: 'Gagal mengambil data. Pastikan URL valid.'
            });
        }
    } catch (error) {
        console.error('X Downloader Error:', error);
        res.render('pages/x-downloader', {
            title: 'X/Twitter Video Downloader',
            result: null,
            error: 'Terjadi kesalahan pada server saat memproses permintaan.'
        });
    }
};