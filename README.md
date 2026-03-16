# PuZero

PuZero adalah platform website serba guna yang menyediakan berbagai layanan mulai dari streaming anime, pengunduh media sosial, hingga integrasi kecerdasan buatan (AI).

## 🚀 Fitur Utama

- **Streaming Anime**: Akses ke daftar anime terbaru, jadwal rilis, filter kategori, dan pencarian.
- **Social Media Downloader**:
  - **Instagram**: Unduh foto dan video.
  - **TikTok**: Unduh video tanpa watermark.
  - **YouTube**: Unduh video dan audio.
  - **SoundCloud**: Unduh trek musik.
  - **X (Twitter)**: Unduh media dari tweet.
- **AI Chat**: Interaksi dengan chatbot AI yang terintegrasi.
- **Tools & Utilities**: Termasuk fitur Image Upscale dan alat bantu lainnya.
- **Fast Update**: Sistem pembaruan konten yang efisien.

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js & Express.js
- **Frontend**: EJS (Embedded JavaScript templates) & Tailwind CSS
- **Web Scraping**: Cheerio & Cloudscraper
- **HTTP Client**: Axios
- **Middleware**: Compression, CORS, Morgan, Multer

## 📦 Instalasi dan Penggunaan

1. **Instal Dependensi**:
   ```bash
   npm install
   ```

2. **Mode Pengembangan (Dev)**:
   Menjalankan Tailwind CSS watcher dan server Node.js secara bersamaan.
   ```bash
   npm run dev
   ```

3. **Produksi**:
   Membangun CSS dan menjalankan server.
   ```bash
   npm start
   ```

## 📂 Struktur Direktori

- `controllers/`: Logika penanganan permintaan untuk setiap fitur.
- `routes/`: Definisi endpoint dan rute halaman.
- `views/`: Template antarmuka pengguna (EJS).
- `public/`: Aset statis seperti CSS, JS, dan gambar.
- `utils/`: Utilitas tambahan dan ekstraktor data.

---
*Dibuat secara otomatis oleh PuruAI.*