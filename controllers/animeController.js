const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');

exports.getAnimePage = async (req, res) => {
    try {
        const url = 'https://v2.samehadaku.how/';
        const response = await cloudscraper.get(url);
        const $ = cheerio.load(response);
        const animeList = [];

        $('.post-show ul li').each((i, el) => {
            const title = $(el).find('.entry-title a').text().trim();
            const link = $(el).find('.entry-title a').attr('href');
            const thumb = $(el).find('.thumb img').attr('src');
            const ep = $(el).find('.dtla span author').first().text().trim();
            const uploaded = $(el).find('.dtla span').last().text().replace('Released on:', '').trim();

            if (title && link) {
                animeList.push({ title, link, thumb, ep, uploaded });
            }
        });

        const data = {
            title: 'PuZero | Anime Terbaru',
            page: 'pages/anime',
            animeList
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Scraping Error:', error);
        res.status(500).send('Gagal mengambil data anime.');
    }
};

exports.getAnimeDetail = async (req, res) => {
    try {
        const animeUrl = req.query.url;
        if (!animeUrl) return res.status(400).send('URL anime diperlukan.');

        const response = await cloudscraper.get(animeUrl);
        const $ = cheerio.load(response);

        const detail = {
            title: $('.infoanime h1.entry-title').text().trim() || $('.entry-title').first().text().trim(),
            thumb: $('.thumb img').attr('src'),
            rating: $('.rtg span[itemprop="ratingValue"]').text().trim(),
            synopsis: $('.desc .entry-content').text().trim(),
            genres: [],
            info: {},
            episodes: []
        };

        $('.genre-info a').each((i, el) => {
            detail.genres.push($(el).text().trim());
        });

        $('.spe span').each((i, el) => {
            const key = $(el).find('b').text().replace(':', '').trim();
            const val = $(el).contents().filter(function() {
                return this.nodeType === 3;
            }).text().trim() || $(el).find('a').text().trim();
            if (key) detail.info[key] = val;
        });

        $('.lstepsiode ul li').each((i, el) => {
            detail.episodes.push({
                eps: $(el).find('.eps a').text().trim(),
                title: $(el).find('.lchx a').text().trim(),
                link: $(el).find('.lchx a').attr('href'),
                date: $(el).find('.date').text().trim()
            });
        });

        const data = {
            title: `PuZero | ${detail.title}`,
            page: 'pages/anime-detail',
            detail
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime-detail', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Detail Scraping Error:', error);
        res.status(500).send('Gagal mengambil detail anime.');
    }
};
