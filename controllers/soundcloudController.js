exports.getSoundCloudPage = (req, res) => {
    const data = {
        title: 'PuZero | SoundCloud Downloader',
        page: 'pages/soundcloud'
    };

    if (req.headers['hx-request']) {
        res.render('pages/soundcloud', data);
    } else {
        res.render('layout', data);
    }
};
