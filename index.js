const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// Import Routes
const indexRoutes = require('./routes/indexRoutes');
const instagramRoutes = require('./routes/instagramRoutes');
const fastUpdateRoutes = require('./routes/fastUpdateRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Gunakan Routes
app.use('/', indexRoutes);
app.use('/instagram', instagramRoutes);
app.use('/fastupdate', fastUpdateRoutes);
app.use('/ai', aiRoutes);

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
