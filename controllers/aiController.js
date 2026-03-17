const axios = require('axios');

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

exports.getTsunderePage = (req, res) => {
    const data = {
        title: 'PuZero | Tsundere AI',
        page: 'pages/ai-tsundere'
    };

    if (req.headers['hx-request']) {
        res.render('pages/ai-tsundere', data);
    } else {
        res.render('layout', data);
    }
};

exports.tsundere = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({
            success: false,
            message: 'Mana teksnya? Dasar baka!'
        });
    }

    try {
        const response = await axios.post('https://puruboy-api.vercel.app/api/ai/tsundere', {
            text: text
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error in tsundere controller:', error.message);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghubungi API. Gomen ne~'
        });
    }
};