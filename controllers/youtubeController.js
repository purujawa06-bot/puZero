exports.getYoutubePage = (req, res) => {
    const data = {
        title: 'PuZero | YouTube Downloader',
        page: 'pages/youtube-downloader'
    };

    if (req.headers['hx-request']) {
        res.render('pages/youtube-downloader', data);
    } else {
        res.render('layout', data);
    }
};
