const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const minifyHTML = require('express-minify-html-2');

const app = express();
const PORT = 8080;

// 1. Gzip Compression
app.use(compression());

// 2. HTML Minifier
app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// No-Cache Middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Autoload Routes
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith('.js')) {
        const route = require(path.join(routesPath, file));
        const routeName = file.replace('Routes.js', '').toLowerCase();
        
        // Map 'index' to root, others to their filename prefix
        const endpoint = routeName === 'index' ? '/' : `/${routeName}`;
        
        app.use(endpoint, route);
        console.log(`Bound route: ${endpoint} -> ${file}`);
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('layout', { 
        title: '404 - Not Found', 
        body: '<div class="text-center py-20"><h1 class="text-4xl font-bold text-slate-800">404</h1><p class="text-slate-500 mt-2">Halaman tidak ditemukan.</p></div>' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 PuZero berjalan di http://localhost:${PORT}`);
});