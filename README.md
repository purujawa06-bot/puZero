# PuZero - React + Express

Platform alat serbaguna berbasis AI. Dibangun ulang menggunakan React (frontend) + Express.js (backend API), siap deploy ke Vercel.

## Struktur Proyek

```
puzero/
├── api/               ← Express.js backend (dijalankan sebagai Vercel Serverless)
│   ├── index.js       ← Server utama + semua API routes
│   └── FiledonExtractor.js
├── src/               ← React frontend
│   ├── components/    ← Navbar, Footer, dll
│   ├── pages/         ← Semua halaman
│   ├── App.jsx        ← Router SPA utama
│   └── main.jsx       ← Entry point React
├── public/            ← Static assets (favicon.jpg, dll)
├── index.html         ← HTML entry point
├── vite.config.js     ← Konfigurasi Vite + proxy API
├── vercel.json        ← Konfigurasi deployment Vercel
└── package.json
```

## Development

```bash
npm install
npm run dev
```

- React berjalan di `http://localhost:3000`
- Express API berjalan di `http://localhost:3001`
- Vite memproxy `/api/*` → Express

## Build untuk Production

```bash
npm run build
```

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Framework Preset: **Other**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Root Directory: `/` (default)
7. Klik Deploy

Vercel secara otomatis akan:
- Menjalankan `api/index.js` sebagai Serverless Function
- Melayani `dist/` sebagai static files
- Semua route SPA diarahkan ke `index.html`

## Fitur

- 🤖 AI Chat (Gemini 3 Flash)
- 📥 Downloader: YouTube, Instagram, TikTok, SoundCloud
- 🎌 Anime: Latest, Filter, Jadwal, Detail, Streaming
- 🖼️ AI Tools: Image Upscale, AI Dubbing, Ghibli Filter
- 🌙 Dark mode
- 📱 Responsive design
