exports.getInstagram = (req, res) => {
    const data = {
        title: 'PuZero | Instagram Downloader',
        page: 'pages/instagram-downloader'
    };

    if (req.headers['hx-request']) {
        res.render('pages/instagram-downloader', data);
    } else {
        res.render('layout', data);
    }
};

exports.downloadMedia = async (req, res) => {
    const { url } = req.body;

    try {
        const response = await fetch('https://puruboy-api.vercel.app/api/downloader/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await response.json();

        if (!data.success) {
            return res.send(`
                <div class="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                    ❌ Gagal mengambil data. Pastikan URL benar atau bersifat publik.
                </div>
            `);
        }

        const result = data.result;
        let mediaHtml = result.medias.map(media => `
            <div class="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${media.quality} ${media.format}</span>
                    <span class="text-sm font-semibold text-slate-700">Ukuran: ${media.size}</span>
                </div>
                <a href="${media.url}" target="_blank" class="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2">
                    <i class="ph-bold ph-download-simple"></i>
                    Download
                </a>
            </div>
        `).join('');

        res.send(`
            <div class="animation-fade-in space-y-6">
                <div class="relative group">
                    <img src="${result.thumbnail}" class="w-full h-56 object-cover rounded-3xl shadow-xl border-4 border-white">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl flex items-end p-6">
                        <p class="text-white font-bold text-sm line-clamp-1">${result.title}</p>
                    </div>
                </div>
                <div class="space-y-3">
                    <h4 class="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Kualitas Media</h4>
                    ${mediaHtml}
                </div>
            </div>
        `);
    } catch (error) {
        res.send(`
            <div class="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                ❌ Terjadi kesalahan sistem: ${error.message}
            </div>
        `);
    }
};
