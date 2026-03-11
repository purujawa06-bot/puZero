// api/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve built React app in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
}

// No-Cache Middleware for API routes
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ===================== ANIME ROUTES =====================
const BASE_URL = 'https://v2.samehadaku.how/';

// GET /api/anime - Latest anime
app.get('/api/anime', async (req, res) => {
  try {
    const response = await cloudscraper.get(BASE_URL);
    const $ = cheerio.load(response);
    const animeList = [];

    $('.post-show ul li').each((i, el) => {
      const title = $(el).find('.entry-title a').text().trim();
      const link = $(el).find('.entry-title a').attr('href') || '';
      const thumb = $(el).find('.thumb img').attr('src');
      const ep = $(el).find('.dtla span author').first().text().trim();
      const uploaded = $(el).find('.dtla span').last().text().replace('Released on:', '').trim();

      if (title && link) {
        const slug = link.replace(BASE_URL, '').replace(/\/$/, '');
        animeList.push({ title, slug, thumb, ep, uploaded });
      }
    });

    res.json({ success: true, data: animeList });
  } catch (error) {
    console.error('Scraping Error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data anime.' });
  }
});

// GET /api/anime/search?q=
app.get('/api/anime/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ success: true, data: [] });

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
        const slug = link.replace(BASE_URL, '').replace(/\/$/, '');
        animeList.push({
          title, slug, thumb,
          ep: score ? `⭐ ${score}` : type,
          uploaded: status || type
        });
      }
    });

    res.json({ success: true, data: animeList, query });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal melakukan pencarian.' });
  }
});

// GET /api/anime/filter
app.get('/api/anime/filter', async (req, res) => {
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
    genreArr.forEach(g => { if (g) params.append('genre[]', g); });

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
        const slug = link.replace(BASE_URL, '').replace(/\/$/, '');
        animeList.push({
          title: titleText, slug, thumb,
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
      if (text) pagination.push({ text, pageNum, isCurrent });
    });

    res.json({ success: true, data: animeList, pagination, filters: { title, status, type, order, genre: genreArr } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data filter.' });
  }
});

// GET /api/anime/schedule?day=
app.get('/api/anime/schedule', async (req, res) => {
  try {
    const dayList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = daysMap[new Date().getDay()];
    const selectedDay = req.query.day || currentDay;

    const apiUrl = `${BASE_URL}wp-json/custom/v1/all-schedule?perpage=50&day=${selectedDay}&type=schtml`;
    const response = await cloudscraper.get({
      uri: apiUrl,
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
    });

    const rawData = JSON.parse(response);
    const schedule = rawData.map(item => ({
      ...item,
      slug: item.url.replace(BASE_URL, '').replace(/\/$/, '')
    }));

    res.json({ success: true, data: schedule, selectedDay, dayList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil jadwal.' });
  }
});

// GET /api/anime/detail/:path(*)
app.get('/api/anime/detail/:path(*)', async (req, res) => {
  try {
    const animePath = req.params.path;
    const animeUrl = `${BASE_URL}${animePath}/`;
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

    $('.genre-info a').each((i, el) => { detail.genres.push($(el).text().trim()); });

    $('.spe span').each((i, el) => {
      const key = $(el).find('b').text().replace(':', '').trim();
      const val = $(el).contents().filter(function() { return this.nodeType === 3; }).text().trim() || $(el).find('a').text().trim();
      if (key) detail.info[key] = val;
    });

    $('.lstepsiode ul li').each((i, el) => {
      const link = $(el).find('.lchx a').attr('href') || '';
      const slug = link.replace(BASE_URL, '').replace(/\/$/, '');
      detail.episodes.push({
        eps: $(el).find('.eps a').text().trim(),
        title: $(el).find('.lchx a').text().trim(),
        slug,
        isEpisode: slug.includes('episode') || !slug.includes('anime'),
        date: $(el).find('.date').text().trim()
      });
    });

    res.json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail anime.' });
  }
});

// GET /api/anime/stream/:path(*)
app.get('/api/anime/stream/:path(*)', async (req, res) => {
  try {
    const animePath = req.params.path;
    const streamUrl = `${BASE_URL}${animePath}/`;
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
          links.push({ server: $(a).text().trim(), link: $(a).attr('href') });
        });
        if (resolution) items.push({ resolution, links });
      });
      if (format) stream.downloads.push({ format, items });
    });

    // PuruZero Server logic
    let filedonLink = null, filedonRes = null;
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
      const slug = link.replace(BASE_URL, '').replace(/\/$/, '');
      stream.episodes.push({
        title: $(el).find('.lchx a').text().trim(),
        slug,
        date: $(el).find('.date').text().trim(),
        thumb: $(el).find('img').attr('src')
      });
    });

    const currentIndex = stream.episodes.findIndex(ep => ep.slug === animePath);
    if (currentIndex !== -1) {
      if (currentIndex > 0) stream.nextEps = stream.episodes[currentIndex - 1].slug;
      if (currentIndex < stream.episodes.length - 1) stream.prevEps = stream.episodes[currentIndex + 1].slug;
    }

    res.json({ success: true, data: stream });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data streaming.' });
  }
});

// POST /api/anime/player
app.post('/api/anime/player', async (req, res) => {
  try {
    const { post, nume, type } = req.body;
    if (!post || !nume || !type) return res.status(400).json({ type: 'error', content: 'Parameter tidak lengkap.' });

    if (type === 'filedon') {
      return res.json({ type: 'video', content: `/api/anime/filedon-stream?url=${encodeURIComponent(post)}` });
    }

    const response = await cloudscraper.post({
      uri: `${BASE_URL}wp-admin/admin-ajax.php`,
      form: { action: 'player_ajax', post, nume, type },
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    });

    const iframeMatch = response.match(/src="([^"]+)"/);
    let finalType = 'html', finalContent = response;

    if (iframeMatch && iframeMatch[1]) {
      const streamUrl = iframeMatch[1];
      if (/\.(mp4|m3u8|webm|mkv)(\?|$)/i.test(streamUrl)) {
        finalType = 'video'; finalContent = streamUrl;
      } else {
        try {
          const streamPage = await cloudscraper.get(streamUrl);
          const videoMatch = streamPage.match(/(https?:\/\/[^\s"'<>]+\.(?:mp4|m3u8|webm))/i) ||
            streamPage.match(/<source[^>]+src="([^"]+)"/i) ||
            streamPage.match(/file:\s*["']([^"']+)["']/i);
          if (videoMatch && /\.(mp4|m3u8|webm)/i.test(videoMatch[1])) {
            finalType = 'video'; finalContent = videoMatch[1];
          } else {
            finalType = 'iframe'; finalContent = streamUrl;
          }
        } catch {
          finalType = 'iframe'; finalContent = streamUrl;
        }
      }
    } else {
      const rawVideoMatch = response.match(/(https?:\/\/[^\s"'<>]+\.(?:mp4|m3u8|webm))/i);
      if (rawVideoMatch) { finalType = 'video'; finalContent = rawVideoMatch[1]; }
    }

    res.json({ type: finalType, content: finalContent });
  } catch (error) {
    res.status(500).json({ type: 'error', content: 'Gagal mengambil player.' });
  }
});

// GET /api/anime/filedon-stream?url=
app.get('/api/anime/filedon-stream', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false });

    const FiledonExtractor = require('./FiledonExtractor');
    const extractor = new FiledonExtractor();
    const extractRes = await extractor.extract(url);

    if (!extractRes.success) return res.status(500).json({ success: false });
    res.redirect(extractRes.data.url);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ===================== TOOLS ROUTES =====================
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/api/tools/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'File tidak ditemukan' });

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    const response = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: formData });
    const data = await response.json();

    if (response.ok && data.status === 'success') {
      const downloadUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      return res.json({ success: true, url: downloadUrl });
    } else {
      return res.status(500).json({ success: false, message: 'Gagal mengupload ke server temporary' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===================== SPA FALLBACK =====================
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 PuZero API berjalan di http://localhost:${PORT}`);
});

module.exports = app;
