const axios = require('axios');

exports.proxyStream = async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL streaming diperlukan.');

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': 'https://v2.samehadaku.how/',
        'Origin': 'https://v2.samehadaku.how',
        'Accept': '*/*'
    };

    if (req.headers.range) {
        headers['Range'] = req.headers.range;
    }

    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: headers,
            responseType: 'stream',
            timeout: 30000
        });

        // Teruskan status dan header penting dari sumber asli
        res.status(response.status);
        
        const importantHeaders = ['content-type', 'content-length', 'content-range', 'accept-ranges'];
        importantHeaders.forEach(header => {
            if (response.headers[header]) {
                res.setHeader(header, response.headers[header]);
            }
        });

        response.data.pipe(res);

        response.data.on('error', (err) => {
            console.error('Axios Stream Pipe Error:', err.message);
            if (!res.headersSent) res.status(500).send('Stream error.');
        });

    } catch (error) {
        console.error('Proxy Stream Axios Error:', error.message);
        if (!res.headersSent) {
            const status = error.response ? error.response.status : 500;
            res.status(status).send('Gagal mem-proxy stream melalui axios.');
        }
    }
};
