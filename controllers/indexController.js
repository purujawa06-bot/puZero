exports.getHome = (req, res) => {
    res.render('layout', {
        title: 'PuZero | Platform Alat AI Serbaguna',
        page: 'pages/home'
    });
};

exports.getCategory = (req, res) => {
    res.render('layout', {
        title: 'PuZero | Pilih Kategori',
        page: 'pages/category'
    });
};
