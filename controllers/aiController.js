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

exports.tsundere = (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({
            status: false,
            message: 'Mana teksnya? Dasar baka!'
        });
    }

    const responses = [
        `Bukannya aku peduli, tapi ini jawaban untuk "${text}"... Hmph!`,
        `Baka! Kenapa kamu tanya "${text}" padaku? Tapi baiklah, aku jawab kali ini saja.`,
        `Jangan senang dulu ya! Aku menjawab "${text}" bukan karena aku menyukaimu!`,
        `Ugh, berisik! Ini: ${text}. Puas?`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    res.json({
        status: true,
        author: 'PuruAI',
        result: randomResponse
    });
};