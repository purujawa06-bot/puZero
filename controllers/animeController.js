const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const axios = require('axios');

const BASE_URL = 'https://v2.samehadaku.how/';
const API_BASE = 'https://puruboy-api.vercel.app/api/anime/samehadaku';

const getSlug = (url) => {
    if (!url) return '';
    return url.replace('https://v2.samehadaku.how/', '').replace(/\/$/, '');
};

exports.getAnimePage = async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE}/home`);
        const { result } = response.data;

        // Map Latest Updates
        const latestUpdates = result.latestUpdates.map(item => ({
            title: item.title,
            slug: getSlug(item.original_url),
            thumb: item.thumbnail,
            ep: `Ep ${item.episode}`,
            uploaded: item.released
        }));

        // Map Top 10
        const top10 = result.top10Weekly.map(item => ({
            title: item.title,
            slug: getSlug(item.original_url),
            thumb: item.thumbnail,
            rank: item.rank,
            score: item.rating
        }));

        // Map Movies
        const movies = result.projectMovies.map(item => ({
            title: item.title,
            slug: getSlug(item.original_url),
            thumb: item.thumbnail,
            genres: item.genres,
            date: item.release_date
        }));

        const data = {
            title: 'PuZero | Update Anime Terbaru',
            page: 'pages/anime',
            latestUpdates,
            top10,
            movies,
            query: ''
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Home API Error:', error);
        res.status(500).send('Gagal mengambil data dari PuruBoy API.');
    }
};

exports.getAnimeList = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await axios.get(`${API_BASE}/list?page=${page}`);
        const { result } = response.data;

        const animeList = result.data.map(item => ({
            title: item.title,
            slug: getSlug(item.original_url),
            thumb: item.thumbnail,
            score: item.score,
            status: item.status,
            type: item.type,
            genres: item.genres
        }));

        const data = {
            title: `PuZero | Daftar Semua Anime - Page ${page}`,
            page: 'pages/anime-list',
            animeList,
            pagination: result.pagination
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime-list', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('List API Error:', error);
        res.status(500).send('Gagal mengambil daftar anime.');
    }
};

exports.getAnimeLatest = async (req, res) => {
    try {
        const page = req.query.page || 1;
        let url = `${BASE_URL}anime-terbaru/`;
        if (page > 1) url += `page/${page}/`;

        const response = await cloudscraper.get(url);
        const $ = cheerio.load(response);
        const animeList = [];

        $('.post-show ul li').each((i, el) => {
            const title = $(el).find('.dtla h2 a').text().trim();
            const link = $(el).find('.dtla h2 a').attr('href') || '';
            const thumb = $(el).find('.thumb img').attr('src');
            const ep = $(el).find('.dtla span').eq(0).find('author').text().trim();
            const released = $(el).find('.dtla span').eq(2).text().replace('Released on:', '').trim();

            if (title && link) {
                const slug = getSlug(link);
                animeList.push({ 
                    title, 
                    slug, 
                    thumb, 
                    ep: ep ? `Ep ${ep}` : '?', 
                    uploaded: released 
                });
            }
        });

        const pagination = [];
        $('.pagination .page-numbers, .pagination .inactive, .pagination .arrow_pag').each((i, el) => {
            const text = $(el).text().trim() || ($(el).find('i').length ? ( $(el).find('i').hasClass('fa-caret-right') ? '>' : '<' ) : '');
            const href = $(el).attr('href');
            const isCurrent = $(el).hasClass('current');
            
            let pageNum = null;
            if (href) {
                const match = href.match(/page\/(\d+)/);
                pageNum = match ? match[1] : (text.match(/\d+/) ? text : null);
            } else if (isCurrent) {
                pageNum = text;
            }

            if (text || pageNum) {
                pagination.push({ text, pageNum, isCurrent });
            }
        });

        const data = {
            title: `PuZero | Anime Terbaru - Page ${page}`,
            page: 'pages/anime-latest',
            animeList,
            pagination
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime-latest', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Latest Anime Error:', error);
        res.status(500).send('Gagal mengambil data anime terbaru.');
    }
};

exports.searchAnime = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.redirect('/anime');

        const searchUrl = `${BASE_URL}?s=${encodeURIComponent(query)}`;
        const response = await cloudscraper.get(searchUrl);
        const $ = cheerio.load(response);
        const animeList = [];

        $('.relat .animpost').each((i, el) => {
            const title = $(el).find('.data .title h2').text().trim();
            const link = $(el).find('a').first().attr('href') || '';
            const thumb = $(el).find('.content-thumb img').attr('src');
            const score = $(el).find('.score').text().trim();
            const type = $(el).find('.content-thumb .type').text().trim();
            const status = $(el).find('.data .type').text().trim();

            if (title && link) {
                const slug = getSlug(link);
                animeList.push({ 
                    title, 
                    slug, 
                    thumb, 
                    ep: score ? `⭐ ${score}` : type, 
                    uploaded: status || type 
                });
            }
        });

        const data = {
            title: `PuZero | Hasil Pencarian: ${query}`,
            page: 'pages/anime-search',
            animeList,
            query
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime-search', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).send('Gagal melakukan pencarian anime.');
    }
};

exports.getAnimeFilter = async (req, res) => {
    try {
        const { title, status, type, order, page } = req.query;
        const genres = req.query.genre || [];
        const genreArr = Array.isArray(genres) ? genres : [genres];

        let filterUrl = `${BASE_URL}daftar-anime-2/`;
        if (page && page > 1) filterUrl += `page/${page}/`;

        const params = new URLSearchParams();
        params.append('title', title || '');
        params.append('status', status || '');
        params.append('type', type || '');
        params.append('order', order || 'title');
        genreArr.forEach(g => {
            if (g) params.append('genre[]', g);
        });

        const finalUrl = `${filterUrl}?${params.toString()}`;
        const response = await cloudscraper.get(finalUrl);
        const $ = cheerio.load(response);
        const animeList = [];

        $('.relat .animpost').each((i, el) => {
            const titleText = $(el).find('.data .title h2').text().trim();
            const link = $(el).find('a').first().attr('href') || '';
            const thumb = $(el).find('.content-thumb img').attr('src');
            const score = $(el).find('.score').text().trim();
            const typeText = $(el).find('.content-thumb .type').text().trim();
            const statusText = $(el).find('.data .type').text().trim();

            if (titleText && link) {
                const slug = getSlug(link);
                animeList.push({ 
                    title: titleText, 
                    slug, 
                    thumb, 
                    ep: score ? `⭐ ${score}` : typeText, 
                    uploaded: statusText || typeText 
                });
            }
        });

        const pagination = [];
        $('.pagination .page-numbers').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');
            const isCurrent = $(el).hasClass('current');
            
            let pageNum = null;
            if (href) {
                const match = href.match(/page\/(\d+)/);
                pageNum = match ? match[1] : (text.match(/\d+/) ? text : null);
            } else if (isCurrent) {
                pageNum = text;
            }

            if (text) {
                pagination.push({ text, pageNum, isCurrent });
            }
        });

        const data = {
            title: 'PuZero | Filter Anime',
            page: 'pages/anime-filter',
            animeList,
            filters: { title, status, type, order, genre: genreArr },
            pagination
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime-filter', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Filter Error:', error);
        res.status(500).send('Gagal mengambil data filter.');
    }
};

exports.getAnimeSchedule = async (req, res) => {
    try {
        const dayList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = daysMap[new Date().getDay()];
        
        const selectedDay = req.query.day || currentDay;

        const apiUrl = `${BASE_URL}wp-json/custom/v1/all-schedule?perpage=50&day=${selectedDay}&type=schtml`;
        
        const response = await cloudscraper.get({
            uri: apiUrl,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        });
        
        const rawData = JSON.parse(response);
        const schedule = rawData.map(item => ({
            ...item,
            slug: getSlug(item.url)
        }));

        const data = {
            title: 'PuZero | Jadwal Rilis Anime',
            page: 'pages/anime-schedule',
            schedule,
            selectedDay,
            dayList
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime-schedule', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Schedule Error:', error);
        res.status(500).send('Gagal mengambil jadwal anime.');
    }
};

exports.getAnimeDetail = async (req, res) => {
    try {
        const path = req.params.path;
        if (!path) return res.status(400).send('Path anime diperlukan.');

        const animeUrl = `${BASE_URL}${path}/`;
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
            const link = $(el).find('.lchx a').attr('href') || '';
            const slug = getSlug(link);
            detail.episodes.push({
                eps: $(el).find('.eps a').text().trim(),
                title: $(el).find('.lchx a').text().trim(),
                slug: slug,
                isEpisode: slug.includes('episode') || !slug.includes('anime'),
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

exports.getAnimeStream = async (req, res) => {
    try {
        const path = req.params.path;
        if (!path) return res.status(400).send('Path streaming diperlukan.');

        const streamUrl = `${BASE_URL}${path}/`;
        const response = await cloudscraper.get(streamUrl);
        const $ = cheerio.load(response);

        const stream = {
            title: $('.entry-title').text().trim(),
            servers: [],
            downloads: [],
            episodes: [],
            prevEps: null,
            nextEps: null
        };

        $('.east_player_option').each((i, el) => {
            stream.servers.push({
                name: $(el).find('span').text().trim(),
                post: $(el).attr('data-post'),
                nume: $(el).attr('data-nume'),
                type: $(el).attr('data-type')
            });
        });

        $('.download-eps').each((i, el) => {
            const format = $(el).find('p b').text().trim();
            const items = [];
            $(el).find('ul li').each((j, li) => {
                const resolution = $(li).find('strong').text().trim();
                const links = [];
                $(li).find('span a').each((k, a) => {
                    links.push({
                        server: $(a).text().trim(),
                        link: $(a).attr('href')
                    });
                });
                if (resolution) items.push({ resolution, links });
            });
            if (format) stream.downloads.push({ format, items });
        });

        let filedonLink = null;
        let filedonRes = null;

        const mp4Dl = stream.downloads.find(dl => dl.format && dl.format.trim().toUpperCase() === 'MP4');
        if (mp4Dl) {
            const mp4hd = mp4Dl.items.find(item => item.resolution && item.resolution.toUpperCase().includes('MP4HD'));
            if (mp4hd) {
                const linkObj = mp4hd.links.find(l => l.link && l.link.includes('filedon.co/'));
                if (linkObj) {
                    const match = linkObj.link.match(/https:\/\/filedon\.co\/[^\s"']+/);
                    filedonLink = match ? match[0] : linkObj.link;
                    filedonRes = '720p';
                }
            }
            if (!filedonLink) {
                const fullhd = mp4Dl.items.find(item => item.resolution && item.resolution.toUpperCase().includes('FULLHD'));
                if (fullhd) {
                    const linkObj = fullhd.links.find(l => l.link && l.link.includes('filedon.co/'));
                    if (linkObj) {
                        const match = linkObj.link.match(/https:\/\/filedon\.co\/[^\s"']+/);
                        filedonLink = match ? match[0] : linkObj.link;
                        filedonRes = '1080p';
                    }
                }
            }
        }

        if (filedonLink) {
            const embedUrl = filedonLink.includes('/view/') ? filedonLink.replace('/view/', '/embed/') : filedonLink;
            stream.servers.unshift({
                name: `PuruZero ⭐ (${filedonRes})`,
                post: embedUrl,
                nume: '1',
                type: 'filedon'
            });
        }

        $('.lstepsiode ul li').each((i, el) => {
            const link = $(el).find('.lchx a').attr('href') || '';
            const slug = getSlug(link);
            stream.episodes.push({
                title: $(el).find('.lchx a').text().trim(),
                slug: slug,
                date: $(el).find('.date').text().trim(),
                thumb: $(el).find('img').attr('src')
            });
        });

        const currentIndex = stream.episodes.findIndex(ep => ep.slug === path);
        if (currentIndex !== -1) {
            if (currentIndex > 0) {
                stream.nextEps = stream.episodes[currentIndex - 1].slug;
            }
            if (currentIndex < stream.episodes.length - 1) {
                stream.prevEps = stream.episodes[currentIndex + 1].slug;
            }
        }

        const data = {
            title: `PuZero | Streaming ${stream.title}`,
            page: 'pages/anime-stream',
            stream
        };

        if (req.headers['hx-request']) {
            res.render('pages/anime-stream', data);
        } else {
            res.render('layout', data);
        }
    } catch (error) {
        console.error('Stream Scraping Error:', error);
        res.status(500).send('Gagal mengambil data streaming.');
    }
};

exports.getStreamPlayer = async (req, res) => {
    try {
        const { post, nume, type } = req.body;
        if (!post || !nume || !type) return res.status(400).send('Parameter tidak lengkap.');

        if (type === 'filedon') {
            return res.json({ type: 'video', content: `/anime/filedon-stream?url=${encodeURIComponent(post)}` });
        }

        const response = await cloudscraper.post({
            uri: `${BASE_URL}wp-admin/admin-ajax.php`,
            form: {
                action: 'player_ajax',
                post,
                nume,
                type
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });

        const iframeMatch = response.match(/src="([^"]+)"/);
        let finalType = 'html';
        let finalContent = response;

        if (iframeMatch && iframeMatch[1]) {
            const streamUrl = iframeMatch[1];
            if (/\.(mp4|m3u8|webm|mkv)(\?|$)/i.test(streamUrl)) {
                finalType = 'video';
                finalContent = streamUrl;
            } else {
                try {
                    const streamPage = await cloudscraper.get(streamUrl);
                    const videoMatch = streamPage.match(/(https?:\/\/[^\s"'<>]+\.(?:mp4|m3u8|webm))/i) || streamPage.match(/<source[^>]+src="([^"]+)"/i) || streamPage.match(/file:\s*["']([^"']+)["']/i);
                    if (videoMatch && videoMatch[1] && /\.(mp4|m3u8|webm)/i.test(videoMatch[1])) {
                        finalType = 'video';
                        finalContent = videoMatch[1];
                    } else {
                        finalType = 'iframe';
                        finalContent = streamUrl;
                    }
                } catch (e) {
                    finalType = 'iframe';
                    finalContent = streamUrl;
                }
            }
        } else {
            const rawVideoMatch = response.match(/(https?:\/\/[^\s"'<>]+\.(?:mp4|m3u8|webm))/i);
            if (rawVideoMatch && rawVideoMatch[1]) {
                finalType = 'video';
                finalContent = rawVideoMatch[1];
            }
        }
        res.json({ type: finalType, content: finalContent });
    } catch (error) {
        console.error('Player Fetch Error:', error);
        res.status(500).json({ type: 'error', content: 'Gagal mengambil player video.' });
    }
};

exports.streamFiledon = async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send('URL diperlukan.');
        const FiledonExtractor = require('../utils/FiledonExtractor');
        const extractor = new FiledonExtractor();
        const extractRes = await extractor.extract(url);
        if (!extractRes.success) return res.status(500).send('Gagal mengekstrak video: ' + extractRes.msg);
        res.redirect(extractRes.data.url);
    } catch (error) {
        console.error('Filedon Redirect Error:', error.message);
        res.status(500).send('Terjadi kesalahan saat mengalihkan ke server video.');
    }
};
