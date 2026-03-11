exports.getChatPage = (req, res) => {
    const data = {
        title: 'PuZero | Gemini 3 Flash AI',
        page: 'pages/ai-chat'
    };

    if (req.headers['hx-request']) {
        res.render('pages/ai-chat', data);
    } else {
        res.render('layout', data);
    }
};
