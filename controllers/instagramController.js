exports.getInstagram = (req, res) => {
    const data = {
        title: 'PuZero | Instagram Downloader',
        page: 'pages/instagram-downloader'
    };

    if (req.headers['hx-request']) {
        res.render('pages/instagram-downloader', data);
    } else {
        res.render('layout', data);
    }
};
