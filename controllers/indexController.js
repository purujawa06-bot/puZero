exports.getHome = (req, res) => {
    const data = {
        title: 'PuZero | Platform Alat AI Serbaguna',
        page: 'pages/home'
    };

    if (req.headers['hx-request']) {
        res.render('pages/home', data);
    } else {
        res.render('layout', data);
    }
};

exports.getCategory = (req, res) => {
    const data = {
        title: 'PuZero | Pilih Kategori',
        page: 'pages/category'
    };

    if (req.headers['hx-request']) {
        res.render('pages/category', data);
    } else {
        res.render('layout', data);
    }
};
