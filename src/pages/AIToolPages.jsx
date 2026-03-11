import { useState, useRef } from 'react'
import BackButton from '../components/BackButton'

function ToolShell({ navigate, icon, iconBg, iconText, title, subtitle, children }) {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 fade-in">
      <div className="mb-8"><BackButton navigate={navigate} /></div>
      <div className="text-center mb-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl ${iconBg} ${iconText} mb-6 shadow-inner relative`}>
          <div className={`absolute inset-0 ${iconBg} opacity-50 blur-xl rounded-full animate-pulse`}></div>
          <i className={`${icon} text-4xl relative z-10`}></i>
        </div>
        <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">{title}</h1>
        <p className="text-slate-500 mt-3 text-lg">{subtitle}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}

function TabSwitcher({ tab, setTab }) {
  return (
    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
      {['url', 'file'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === t ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-secondary dark:hover:text-white'}`}>
          {t === 'url' ? 'URL Gambar' : 'Upload File'}
        </button>
      ))}
    </div>
  )
}

export function UpscalePage({ navigate }) {
  const [tab, setTab] = useState('url')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const addLog = (text, color = 'text-slate-400') => setLogs(prev => [...prev, { text, color }])

  const process = async () => {
    if (tab === 'url' && !url) return alert('Masukkan URL Gambar dulu!')
    if (tab === 'file' && !file) return alert('Pilih file gambar dulu!')
    setResult(null); setError(''); setLogs([]); setLoading(true)
    addLog('Memulai proses...', 'text-slate-500')
    try {
      let imageUrl = url
      if (tab === 'file') {
        addLog('Uploading file ke server temporary...', 'text-yellow-400')
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await fetch('/api/tools/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadData.success) throw new Error(uploadData.message || 'Gagal mengupload gambar.')
        imageUrl = uploadData.url
        addLog(`Upload berhasil. URL: ${imageUrl.substring(0, 30)}...`, 'text-emerald-400')
      }

      addLog('Menghubungi AI Upscale Engine...', 'text-indigo-400')
      const response = await fetch('https://puruboy-api.vercel.app/api/tools/upscale', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let tempUrl = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n').filter(l => l.trim())) {
          addLog(line, 'text-slate-400')
          if (line.includes('[true]')) tempUrl = line.replace('[true]', '').trim()
        }
      }
      if (!tempUrl) throw new Error('Gagal mendapatkan link temp hasil upscale.')

      addLog('Mengambil hasil akhir...', 'text-indigo-400')
      const finalRes = await fetch(tempUrl)
      const finalData = await finalRes.json()
      if (!finalData.output) throw new Error('Output tidak ditemukan.')
      setResult(finalData.output)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <ToolShell navigate={navigate} icon="ph-bold ph-arrows-out" iconBg="bg-indigo-500/10" iconText="text-indigo-500" title="AI Image Upscaler" subtitle="Tingkatkan resolusi dan kualitas gambar Anda menggunakan AI.">
      <TabSwitcher tab={tab} setTab={setTab} />
      <div className="space-y-4">
        {tab === 'url' ? (
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Image URL</label>
            <div className="relative">
              <i className="ph-bold ph-link absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.jpg"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Pilih Gambar</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}
              className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl outline-none transition-all font-medium text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 cursor-pointer" />
            <p className="text-[10px] text-slate-400 mt-2 px-1 italic">* Maksimal 5MB. Gambar akan diupload sementara.</p>
          </div>
        )}
        <button onClick={process} disabled={loading} className="w-full py-5 bg-secondary hover:bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">
          {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Memproses...</> : <><i className="ph-bold ph-sparkle text-xl"></i>Upscale Gambar</>}
        </button>
      </div>
      {loading && (
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="w-full max-w-md bg-slate-900 rounded-xl p-4 font-mono text-[10px] space-y-1 overflow-y-auto max-h-40 custom-scrollbar">
            {logs.map((l, i) => <p key={i} className={l.color}>&gt; {l.text}</p>)}
          </div>
        </div>
      )}
      {result && (
        <div className="mt-8 space-y-6 fade-in">
          <div className="relative group">
            <img src={result} className="w-full rounded-3xl shadow-xl border-4 border-white" alt="Upscaled" />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg">AI ENHANCED</span>
            </div>
          </div>
          <a href={result} target="_blank" download="upscaled_image.png" className="w-full py-4 bg-primary hover:bg-indigo-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg">
            <i className="ph-bold ph-download-simple"></i> Download Hasil Upscale
          </a>
        </div>
      )}
      {error && <div className="mt-8 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">❌ Error: {error}</div>}
    </ToolShell>
  )
}

export function DubbingPage({ navigate }) {
  const [url, setUrl] = useState('')
  const [voice, setVoice] = useState('id-ID')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const addLog = (text, color = 'text-slate-400') => setLogs(prev => [...prev, { text, color }])

  const startDubbing = async () => {
    if (!url) return alert('Masukkan URL Video dulu!')
    setResult(null); setError(''); setLogs([]); setLoading(true)
    addLog('Memulai request dubbing...', 'text-slate-500')
    try {
      let inputUrl = url
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        addLog('Terdeteksi link YouTube. Mengonversi ke link direct...', 'text-red-400')
        const ytRes = await fetch('https://www.puruboy.kozow.com/api/downloader/savetube', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, quality: '480', type: 'video' })
        })
        const ytData = await ytRes.json()
        if (ytData.success && ytData.result.downloadUrl) {
          inputUrl = ytData.result.downloadUrl
          addLog(`Konversi YouTube berhasil: ${ytData.result.title?.substring(0, 20)}...`, 'text-emerald-400')
        } else throw new Error('Gagal mengunduh video dari YouTube sebagai input.')
      }

      const response = await fetch('https://www.puruboy.kozow.com/api/tools/dubbing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl, voice, prompt })
      })
      const data = await response.json()
      if (data.status !== 'queued') throw new Error('Gagal antri ke server.')

      let pollingUrl = data.pollingUrl
      addLog('Tugas masuk antrean. Polling dimulai...', 'text-blue-400')
      let completed = false, attempts = 0

      while (!completed && attempts < 120) {
        attempts++
        addLog(`Mengecek status... (${attempts})`, 'text-slate-400')
        const pollRes = await fetch(pollingUrl)
        const pollData = await pollRes.json()
        if (pollData.success && pollData.result.status === 'Selesai') {
          completed = true
          addLog('Selesai! Mengambil link download...', 'text-emerald-400')
          setResult(pollData.result.downloadUrl)
        } else {
          await new Promise(r => setTimeout(r, 5000))
        }
      }
      if (!completed) throw new Error('Waktu tunggu habis.')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <ToolShell navigate={navigate} icon="ph-bold ph-microphone-stage" iconBg="bg-rose-500/10" iconText="text-rose-500" title="AI Video Dubbing" subtitle="Ubah suara video Anda ke berbagai bahasa menggunakan AI.">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Video Direct URL / YouTube Link</label>
          <div className="relative">
            <i className="ph-bold ph-link absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/video.mp4 atau link YouTube"
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-rose-500 outline-none transition-all font-medium text-sm text-slate-700 dark:text-slate-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Voice / Language</label>
            <select value={voice} onChange={e => setVoice(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-rose-500 outline-none transition-all font-bold text-sm text-slate-700 dark:text-slate-200">
              <option value="id-ID">Bahasa Indonesia (id-ID)</option>
              <option value="en-US">English (en-US)</option>
              <option value="ja-JP">Japanese (ja-JP)</option>
              <option value="ko-KR">Korean (ko-KR)</option>
              <option value="ar-SA">Arabic (ar-SA)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Dubbing Prompt (Style)</label>
            <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Contoh: Santai Dan Gaul Bro"
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-rose-500 outline-none transition-all font-medium text-sm text-slate-700 dark:text-slate-200" />
          </div>
        </div>
        <button onClick={startDubbing} disabled={loading} className="w-full py-5 bg-secondary hover:bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">
          {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Memproses...</> : <><i className="ph-bold ph-magic-wand text-xl"></i>Proses Dubbing</>}
        </button>
      </div>
      {loading && (
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="w-full max-w-md bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-rose-400 space-y-1 overflow-y-auto max-h-40">
            {logs.map((l, i) => <p key={i} className={l.color}>&gt; {l.text}</p>)}
          </div>
        </div>
      )}
      {result && (
        <div className="mt-8 space-y-6 fade-in">
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="ph-bold ph-check text-2xl"></i>
            </div>
            <h3 className="text-lg font-black text-emerald-900">Dubbing Berhasil!</h3>
            <p className="text-emerald-600 text-sm mt-1">Video Anda telah berhasil diproses.</p>
          </div>
          <a href={result} target="_blank" className="w-full py-5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-rose-200">
            <i className="ph-bold ph-download-simple text-xl"></i> Download Video Dubbing
          </a>
        </div>
      )}
      {error && <div className="mt-8 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">❌ Error: {error}</div>}
    </ToolShell>
  )
}

export function GhibliPage({ navigate }) {
  const [tab, setTab] = useState('url')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const addLog = (text, color = 'text-slate-400') => setLogs(prev => [...prev, { text, color }])

  const process = async () => {
    if (tab === 'url' && !url) return alert('Masukkan URL Gambar dulu!')
    if (tab === 'file' && !file) return alert('Pilih file gambar dulu!')
    setResult(null); setError(''); setLogs([]); setLoading(true)
    addLog('Memulai proses Ghibli...', 'text-slate-500')
    try {
      let imageUrl = url
      if (tab === 'file') {
        addLog('Mengupload gambar ke server temporary...', 'text-yellow-400')
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await fetch('/api/tools/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadData.success) throw new Error(uploadData.message)
        imageUrl = uploadData.url
        addLog(`Gambar siap: ${imageUrl.substring(0, 25)}...`, 'text-emerald-400')
      }

      addLog('Memproses gambar ke gaya Ghibli...', 'text-teal-400')
      const response = await fetch('https://www.puruboy.kozow.com/api/tools/ghibli', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, prompt: prompt || 'Jadikan ghibli' })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let tempUrl = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value).split('\n').filter(l => l.trim())) {
          addLog(line, 'text-slate-400')
          if (line.includes('[true]')) tempUrl = line.replace('[true]', '').trim()
        }
      }
      if (!tempUrl) throw new Error('Gagal memproses gambar.')

      addLog('Mendownload hasil akhir...', 'text-teal-400')
      const finalRes = await fetch(tempUrl)
      const finalData = await finalRes.json()
      if (!finalData.output) throw new Error('Output tidak valid.')
      setResult(finalData.output)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <ToolShell navigate={navigate} icon="ph-bold ph-paint-brush-broad" iconBg="bg-teal-500/10" iconText="text-teal-500" title="AI Ghibli Filter" subtitle="Ubah gambar Anda menjadi mahakarya gaya Studio Ghibli.">
      <TabSwitcher tab={tab} setTab={setTab} />
      <div className="space-y-4">
        {tab === 'url' ? (
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Image URL</label>
            <div className="relative">
              <i className="ph-bold ph-link absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.jpg"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-teal-500 outline-none transition-all font-medium text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Pilih Gambar</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}
              className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl outline-none transition-all font-medium text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 cursor-pointer" />
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Custom Prompt (Opsional)</label>
          <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Contoh: Jadikan ghibli yang estetik"
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-teal-500 outline-none transition-all font-medium text-sm text-slate-700 dark:text-slate-200" />
        </div>
        <button onClick={process} disabled={loading} className="w-full py-5 bg-secondary hover:bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">
          {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Memproses...</> : <><i className="ph-bold ph-sparkle text-xl"></i>Transformasi Ghibli</>}
        </button>
      </div>
      {loading && (
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="w-full max-w-md bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-teal-400 space-y-1 overflow-y-auto max-h-40">
            {logs.map((l, i) => <p key={i} className={l.color}>&gt; {l.text}</p>)}
          </div>
        </div>
      )}
      {result && (
        <div className="mt-8 space-y-6 fade-in">
          <div className="relative">
            <img src={result} className="w-full rounded-3xl shadow-xl border-4 border-white" alt="Ghibli result" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-teal-500 text-white text-[10px] font-black rounded-full shadow-lg">GHIBLI STYLE</span>
            </div>
          </div>
          <a href={result} target="_blank" className="w-full py-4 bg-primary hover:bg-indigo-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all">
            <i className="ph-bold ph-download-simple"></i> Simpan Gambar
          </a>
        </div>
      )}
      {error && <div className="mt-8 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">❌ Error: {error}</div>}
    </ToolShell>
  )
}
