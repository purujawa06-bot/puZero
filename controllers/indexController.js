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

exports.getFeatures = (req, res) => {
    const data = {
        title: 'PuZero | Pelajari Fitur',
        page: 'pages/features'
    };

    if (req.headers['hx-request']) {
        res.render('pages/features', data);
    } else {
        res.render('layout', data);
    }
};

exports.getTOS = (req, res) => {
    const data = {
        title: 'PuZero | Terms of Service',
        page: 'pages/tos'
    };

    if (req.headers['hx-request']) {
        res.render('pages/tos', data);
    } else {
        res.render('layout', data);
    }
};

exports.getPrivacy = (req, res) => {
    const data = {
        title: 'PuZero | Privacy Policy',
        page: 'pages/privacy'
    };

    if (req.headers['hx-request']) {
        res.render('pages/privacy', data);
    } else {
        res.render('layout', data);
    }
};
