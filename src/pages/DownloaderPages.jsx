import { useState } from 'react'
import BackButton from '../components/BackButton'

function DownloaderShell({ navigate, icon, iconBg, iconText, title, subtitle, accentColor = 'primary', children }) {
  return (
    <div className="max-w-3xl mx-auto py-10 md:py-16 px-4 sm:px-6 fade-in flex-grow">
      <div className="mb-6 md:mb-8">
        <BackButton navigate={navigate} />
      </div>
      <div className="text-center mb-10 md:mb-12">
        <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${iconBg} ${iconText} mb-4 md:mb-6 shadow-inner relative`}>
          <div className={`absolute inset-0 ${iconBg} opacity-50 blur-xl rounded-full animate-pulse`}></div>
          <i className={`${icon} text-3xl md:text-4xl relative z-10`}></i>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-secondary dark:text-white tracking-tight">{title}</h1>
        <p className="text-slate-500 mt-2 md:mt-3 text-base md:text-lg">{subtitle}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-1.5 md:p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800 relative">
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}

export function YouTubePage({ navigate }) {
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('480')
  const [type, setType] = useState('video')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const download = async () => {
    if (!url) return alert('Masukkan URL YouTube dulu!')
    setResult(null); setError(''); setLoading(true)
    try {
      const res = await fetch('https://www.puruboy.kozow.com/api/downloader/savetube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality, type })
      })
      const data = await res.json()
      if (!data.success) throw new Error('Gagal mengambil data YouTube.')
      setResult(data.result)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <DownloaderShell navigate={navigate} icon="ph-bold ph-youtube-logo" iconBg="bg-red-600/10" iconText="text-red-600" title="YouTube Downloader" subtitle="Unduh video YouTube dengan kualitas tinggi dengan mudah.">
      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">YouTube Video Link</label>
          <div className="relative">
            <i className="ph-bold ph-link absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"></i>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-red-600 outline-none transition-all font-medium text-base md:text-sm text-slate-700 dark:text-slate-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Kualitas</label>
            <select value={quality} onChange={e => setQuality(e.target.value)} className="w-full px-4 md:px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:border-red-600 outline-none transition-all font-bold text-base md:text-sm text-slate-700 dark:text-slate-200">
              <option value="360">360p</option>
              <option value="480">480p</option>
              <option value="720">720p</option>
              <option value="1080">1080p</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Tipe</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 md:px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:border-red-600 outline-none transition-all font-bold text-base md:text-sm text-slate-700 dark:text-slate-200">
              <option value="video">Video (MP4)</option>
              <option value="audio">Audio (MP3)</option>
            </select>
          </div>
        </div>
        <button onClick={download} disabled={loading} className="w-full py-4 md:py-5 bg-secondary hover:bg-slate-800 text-white font-black rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all hover:shadow-lg active:scale-[0.98] text-base disabled:opacity-60">
          {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Memproses...</> : <><i className="ph-bold ph-download-simple text-lg md:text-xl"></i>Dapatkan Link Download</>}
        </button>
        {result && (
          <div className="mt-8 space-y-6 fade-in">
            <div className="flex flex-col sm:flex-row gap-5 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <img src={result.thumbnail} className="w-full sm:w-32 md:w-40 h-auto object-cover rounded-xl shadow-md shrink-0" alt="" />
              <div className="flex-grow space-y-2.5 flex flex-col justify-center">
                <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-md uppercase tracking-widest shadow-sm w-fit">{result.type} • {result.quality}p</span>
                <h3 className="text-base md:text-lg font-black text-secondary dark:text-white leading-snug line-clamp-2">{result.title}</h3>
                <a href={result.downloadUrl} target="_blank" className="w-full py-3.5 bg-primary hover:bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-sm md:text-base">
                  <i className="ph-bold ph-download-simple"></i> Download Sekarang
                </a>
              </div>
            </div>
          </div>
        )}
        {error && <div className="p-4 text-xs md:text-sm text-red-800 rounded-xl bg-red-50 border border-red-200 font-medium">❌ Error: {error}</div>}
      </div>
    </DownloaderShell>
  )
}

export function TikTokPage({ navigate }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const download = async () => {
    if (!url) return alert('Masukkan URL TikTok dulu!')
    setResult(null); setError(''); setLoading(true)
    try {
      const res = await fetch('https://puruboy-api.vercel.app/api/downloader/snaptik', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (!data.success) throw new Error('Gagal mengambil data TikTok.')
      setResult(data.result)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <DownloaderShell navigate={navigate} icon="ph-bold ph-tiktok-logo" iconBg="bg-slate-900/10" iconText="text-slate-900 dark:text-white" title="TikTok Downloader" subtitle="Download Video TikTok Tanpa Watermark.">
      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">TikTok Link</label>
          <div className="relative">
            <i className="ph-bold ph-link absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"></i>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.tiktok.com/@user/video/..."
              className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-primary outline-none transition-all font-medium text-base md:text-sm text-slate-700 dark:text-slate-200" />
          </div>
        </div>
        <button onClick={download} disabled={loading} className="w-full py-4 md:py-5 bg-secondary hover:bg-slate-800 text-white font-black rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all hover:shadow-lg active:scale-[0.98] text-base disabled:opacity-60">
          {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Menganalisis...</> : <><i className="ph-bold ph-download-simple text-lg md:text-xl"></i>Ambil Video</>}
        </button>
        {result && (
          <div className="mt-8 space-y-5 fade-in">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center sm:text-left">
              <img src={result.video_info?.thumbnail} className="w-24 h-32 object-cover rounded-xl shadow-md shrink-0" alt="" />
              <div className="space-y-2">
                <p className="text-[10px] md:text-xs font-black text-primary uppercase tracking-widest">@{result.video_info?.author}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed line-clamp-3">{result.video_info?.title}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Download Links</h4>
              {result.download_links?.map((link, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm mb-3 gap-3">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{link.type}</span>
                  <a href={link.url} target="_blank" className="w-full sm:w-auto px-5 py-3 bg-primary hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                    <i className="ph-bold ph-download-simple"></i> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <div className="p-4 text-xs md:text-sm text-red-800 rounded-xl bg-red-50 border border-red-200 font-medium">❌ Error: {error}</div>}
      </div>
    </DownloaderShell>
  )
}

export function InstagramPage({ navigate }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const download = async () => {
    if (!url) return alert('Masukkan URL Instagram dulu!')
    setResult(null); setError(''); setLoading(true)
    try {
      const res = await fetch('https://puruboy-api.vercel.app/api/downloader/instagram', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (!data.success) throw new Error('Gagal mengambil data. Pastikan URL benar/publik.')
      setResult(data.result)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <DownloaderShell navigate={navigate} icon="ph-bold ph-instagram-logo" iconBg="bg-pink-500/10" iconText="text-pink-500" title="Instagram Downloader" subtitle="Download Reels, Video, dan Foto Instagram dengan mudah.">
      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Instagram Link</label>
          <div className="relative">
            <i className="ph-bold ph-link absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"></i>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.instagram.com/reel/..."
              className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-pink-500 outline-none transition-all font-medium text-base md:text-sm text-slate-700 dark:text-slate-200" />
          </div>
        </div>
        <button onClick={download} disabled={loading} className="w-full py-4 md:py-5 bg-secondary hover:bg-slate-800 text-white font-black rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all hover:shadow-lg active:scale-[0.98] text-base disabled:opacity-60">
          {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Fetching...</> : <><i className="ph-bold ph-download-simple text-lg md:text-xl"></i>Ambil Media</>}
        </button>
        {result && (
          <div className="mt-8 space-y-6 fade-in">
            <div className="relative group rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <img src={result.thumbnail} className="w-full h-48 sm:h-64 object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <p className="text-white font-medium text-sm line-clamp-2">{result.title}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Kualitas Media</h4>
              {result.medias?.map((media, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm mb-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{media.quality} {media.format}</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Ukuran: {media.size}</span>
                  </div>
                  <a href={media.url} target="_blank" className="w-full sm:w-auto px-5 py-3 bg-primary hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                    <i className="ph-bold ph-download-simple"></i> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <div className="p-4 text-xs md:text-sm text-red-800 rounded-xl bg-red-50 border border-red-200 font-medium">❌ Error: {error}</div>}
      </div>
    </DownloaderShell>
  )
}

export function SoundCloudPage({ navigate }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [track, setTrack] = useState(null)
  const [error, setError] = useState('')

  const process = async () => {
    if (!input.trim()) return alert('Masukkan link atau judul lagu!')
    if (input.trim().startsWith('http')) await downloadSC(input.trim())
    else await searchSC(input.trim())
  }

  const searchSC = async (query) => {
    setResults([]); setTrack(null); setError(''); setLoading(true)
    try {
      const res = await fetch(`https://www.puruboy.kozow.com/api/search/soundcloud?q=${encodeURIComponent(query)}&limit=10`)
      const data = await res.json()
      if (!data.success) throw new Error('Pencarian gagal.')
      setResults(data.result)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const downloadSC = async (url) => {
    setResults([]); setTrack(null); setError(''); setLoading(true)
    try {
      const res = await fetch('https://www.puruboy.kozow.com/api/downloader/soundcloud-v2', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (!data.success) throw new Error('Gagal mengambil detail lagu.')
      setTrack(data.result)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 fade-in">
      <div className="mb-8"><BackButton navigate={navigate} /></div>
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-500/10 text-orange-500 mb-6 shadow-inner relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse"></div>
          <i className="ph-bold ph-soundcloud-logo text-4xl relative z-10"></i>
        </div>
        <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">SoundCloud Downloader</h1>
        <p className="text-slate-500 mt-3 text-lg">Unduh musik SoundCloud via Link atau Pencarian judul.</p>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-secondary dark:text-white mb-6 flex items-center gap-2">
            <i className="ph-bold ph-magnifying-glass text-orange-500"></i> Input Musik
          </h3>
          <div className="space-y-4">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.keyCode === 13 && process()}
              placeholder="Paste link SoundCloud atau Ketik judul lagu..."
              className="w-full pl-6 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-orange-500 outline-none transition-all font-medium text-slate-700 dark:text-slate-200" />
            <button onClick={process} disabled={loading} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/20 disabled:opacity-60">
              {loading ? 'Menghubungi Server...' : 'Proses Sekarang'}
            </button>
          </div>
        </div>
      </div>
      {results.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-4">
          {results.map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-orange-200 transition-all shadow-sm">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <i className="ph-fill ph-music-notes text-2xl"></i>
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-800 dark:text-white truncate">{t.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{t.user} • {t.duration} • {t.plays} plays</p>
                </div>
              </div>
              <button onClick={() => downloadSC(t.url)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 group-hover:bg-orange-500 group-hover:text-white text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold transition-all shrink-0">
                Ambil Link
              </button>
            </div>
          ))}
        </div>
      )}
      {track && (
        <div className="mt-12">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <img src={track.thumbnail} className="w-48 h-48 rounded-3xl shadow-xl object-cover border-4 border-white" alt="" />
              <div className="flex-grow text-center md:text-left space-y-4">
                <div>
                  <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">SoundCloud Audio</span>
                  <h2 className="text-2xl font-black text-secondary dark:text-white mt-2 leading-tight">{track.title}</h2>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">{track.author}</p>
                </div>
                <a href={track.url} target="_blank" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 w-fit mx-auto md:mx-0">
                  <i className="ph-bold ph-download-simple"></i> Download MP3
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <div className="mt-12 p-6 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100">{error}</div>}
    </div>
  )
}
