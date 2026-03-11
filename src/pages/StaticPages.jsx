// FeaturesPage.jsx
export function FeaturesPage() {
  const features = [
    { icon: 'ph-bold ph-lightning', color: 'bg-primary/10 text-primary', title: 'AI Chat Performa Tinggi', desc: 'Gunakan model Gemini 3 Flash terbaru untuk membantu coding, menulis artikel, atau sekadar teman ngobrol yang cerdas.' },
    { icon: 'ph-bold ph-instagram-logo', color: 'bg-pink-500/10 text-pink-500', title: 'Downloader Media Cepat', desc: 'Unduh video Reels, foto, dan konten TikTok tanpa watermark dalam hitungan detik dengan kualitas original.' },
    { icon: 'ph-bold ph-layout', color: 'bg-indigo-500/10 text-indigo-500', title: 'Modern & SPA-like', desc: 'Navigasi antar halaman terasa sangat cepat tanpa reload penuh berkat React Router.' },
    { icon: 'ph-bold ph-shield-check', color: 'bg-emerald-500/10 text-emerald-500', title: 'Privasi & Keamanan', desc: 'Semua riwayat chat disimpan secara lokal di browser Anda. Kami tidak menyimpan data sensitif di server kami.' },
  ]
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-secondary dark:text-white mb-6">Fitur Unggulan</h1>
        <p className="text-slate-500 text-lg">Eksplorasi apa yang bisa Anda lakukan dengan ekosistem PuZero.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-6`}>
              <i className={`${f.icon} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">{f.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TosPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 fade-in prose prose-slate dark:prose-invert">
      <h1 className="font-black text-secondary dark:text-white">Terms of Service</h1>
      <p className="text-slate-500">Terakhir diperbarui: {new Date().toLocaleDateString()}</p>
      <h3>1. Penggunaan Layanan</h3>
      <p>PuZero menyediakan alat bantu AI dan pengunduhan media untuk penggunaan personal. Anda setuju untuk tidak menyalahgunakan platform ini untuk kegiatan ilegal atau melanggar hak cipta pihak lain.</p>
      <h3>2. Hak Kekayaan Intelektual</h3>
      <p>Seluruh media yang diunduh melalui platform kami tetap menjadi hak milik dari pembuat konten asli. Kami hanya menyediakan jembatan teknis untuk akses media tersebut.</p>
      <h3>3. Batasan Tanggung Jawab</h3>
      <p>PuZero tidak bertanggung jawab atas kesalahan output yang dihasilkan oleh AI (Gemini 3 Flash). AI dapat memberikan informasi yang tidak akurat.</p>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 fade-in prose prose-slate dark:prose-invert">
      <h1 className="font-black text-secondary dark:text-white">Privacy Policy</h1>
      <p className="text-slate-500">Terakhir diperbarui: {new Date().toLocaleDateString()}</p>
      <h3>1. Data yang Kami Kumpulkan</h3>
      <p>Kami tidak mengumpulkan data pribadi di server kami. Semua riwayat percakapan AI disimpan menggunakan <strong>LocalStorage</strong> di browser perangkat Anda sendiri.</p>
      <h3>2. Penggunaan API Pihak Ketiga</h3>
      <p>Layanan kami menggunakan API pihak ketiga (seperti Puruboy-API untuk pengunduhan dan AI). Permintaan Anda diteruskan ke API tersebut secara anonim.</p>
      <h3>3. Cookies</h3>
      <p>Kami tidak menggunakan tracking cookies pihak ketiga. Penggunaan penyimpanan lokal murni untuk fungsionalitas aplikasi.</p>
    </div>
  )
}

export function NotFoundPage({ navigate }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-white">404</h1>
      <p className="text-slate-500 mt-2 mb-6">Halaman tidak ditemukan.</p>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Kembali ke Home</button>
    </div>
  )
}
