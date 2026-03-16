# PuZero - Puru Zero Website Serba Guna

PuZero adalah platform website serba guna yang menyediakan berbagai layanan mulai dari streaming anime, pengunduh media sosial, hingga fitur berbasis AI.

## Fitur Utama

- **Anime Platform**: Streaming anime dengan fitur pencarian, jadwal, filter, dan daftar episode terbaru.
- **Social Media Downloader**:
  - Instagram Downloader
  - TikTok Downloader
  - X (Twitter) Downloader
  - YouTube Downloader
  - SoundCloud Downloader
- **AI & Tools**:
  - AI Chat
  - Image Upscale
  - Dubbing Tool
- **Ghibli Collection**: Informasi dan koleksi film Studio Ghibli.

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates), Tailwind CSS
- **Data Fetching/Parsing**: Axios, Cheerio, Cloudscraper
- **Middleware**: Compression, Cors, Morgan, Multer

## Cara Instalasi

1. Clone repositori ini.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```
4. Atau jalankan aplikasi untuk produksi:
   ```bash
   npm start
   ```

## Struktur Proyek

- `controllers/`: Logika penanganan permintaan untuk setiap rute.
- `routes/`: Definisi rute API dan halaman.
- `views/`: Template tampilan menggunakan EJS.
- `public/`: File statis seperti CSS, JS, dan gambar.
- `utils/`: Fungsi pembantu (extractor).

---
© 2024 PuZero.