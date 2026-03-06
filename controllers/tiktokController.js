exports.getTiktokPage = (req, res) => {
    const data = {
        title: 'PuZero | TikTok Downloader',
        page: 'pages/tiktok-downloader'
    };

    if (req.headers['hx-request']) {
        res.render('pages/tiktok-downloader', data);
    } else {
        res.render('layout', data);
    }
};
