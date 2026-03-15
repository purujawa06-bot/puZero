const axios = require('axios');

const API_BASE = 'https://www.puruboy.kozow.com/api/anime/komiku';

exports.getMangaHome = async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE}/home`);
        const mangaList = response.data.result;

        const data = {
            title: 'PuZero | Update Manga Terbaru',
            page: 'pages/manga',
            mangaList,
            query: ''
        };

        if (req.headers['hx-request']) {
            res.render('pages/manga', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Manga Home Error:', error);
        res.status(500).send('Gagal mengambil data manga.');
    }
};

exports.getMangaPopular = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await axios.get(`${API_BASE}/popular?page=${page}`);
        const mangaList = response.data.result;

        const data = {
            title: 'PuZero | Manga Populer',
            page: 'pages/manga-popular',
            mangaList,
            pageNumber: parseInt(page)
        };

        if (req.headers['hx-request']) {
            res.render('pages/manga-popular', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Manga Popular Error:', error);
        res.status(500).send('Gagal mengambil manga populer.');
    }
};

exports.searchManga = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.redirect('/manga');

        const response = await axios.get(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        const mangaList = response.data.result;

        const data = {
            title: `PuZero | Cari Manga: ${query}`,
            page: 'pages/manga-search',
            mangaList,
            query
        };

        if (req.headers['hx-request']) {
            res.render('pages/manga-search', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Manga Search Error:', error);
        res.status(500).send('Gagal mencari manga.');
    }
};

exports.getMangaDetail = async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send('URL manga diperlukan.');

        const response = await axios.get(`${API_BASE}/detail?url=${encodeURIComponent(url)}`);
        const detail = response.data.result;

        const data = {
            title: `PuZero | ${detail.title}`,
            page: 'pages/manga-detail',
            detail,
            originalUrl: url
        };

        if (req.headers['hx-request']) {
            res.render('pages/manga-detail', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Manga Detail Error:', error);
        res.status(500).send('Gagal mengambil detail manga.');
    }
};

exports.readManga = async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send('URL chapter diperlukan.');

        const response = await axios.get(`${API_BASE}/read?url=${encodeURIComponent(url)}`);
        const result = response.data.result;

        const data = {
            title: `PuZero | Baca ${result.title}`,
            page: 'pages/manga-read',
            result,
            chapterUrl: url
        };

        if (req.headers['hx-request']) {
            res.render('pages/manga-read', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Manga Read Error:', error);
        res.status(500).send('Gagal memuat chapter manga.');
    }
};