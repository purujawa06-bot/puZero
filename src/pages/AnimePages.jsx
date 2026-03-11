import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'

export function AnimePage({ navigate }) {
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchAnime()
  }, [query])

  const fetchAnime = async () => {
    setLoading(true)
    try {
      const url = query ? `/api/anime/search?q=${encodeURIComponent(query)}` : '/api/anime'
      const res = await fetch(url)
      const data = await res.json()
      setAnimeList(data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(searchInput)
  }

  return (
    <div className="relative overflow-hidden flex-grow fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white tracking-tight mb-2">
              Anime <span className="text-primary">Terbaru</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Update anime terbaru dari samehadaku.</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Cari anime..."
                className="pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold text-slate-700 dark:text-slate-300 w-48 sm:w-64"
              />
            </div>
            <button type="submit" className="px-5 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95">Cari</button>
            {query && (
              <button type="button" onClick={() => { setQuery(''); setSearchInput('') }} className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">Reset</button>
            )}
          </form>
        </div>

        {query && <p className="mb-6 text-sm text-slate-500">Hasil pencarian: <span className="font-bold text-secondary dark:text-white">"{query}"</span> ({animeList.length} hasil)</p>}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {animeList.map((anime, i) => (
              <AnimeCard key={i} anime={anime} navigate={navigate} />
            ))}
            {animeList.length === 0 && <p className="col-span-full text-center text-slate-500 py-20">Anime tidak ditemukan.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

function AnimeCard({ anime, navigate }) {
  return (
    <div
      onClick={() => navigate(`/anime/detail/${anime.slug}`)}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={anime.thumb} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {anime.ep && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary text-white text-[9px] font-black rounded-lg shadow-lg backdrop-blur-sm">{anime.ep}</span>
          </div>
        )}
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-bold text-xs md:text-sm text-secondary dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">{anime.title}</h3>
        {anime.uploaded && <p className="text-[9px] md:text-[10px] text-slate-400 mt-1 font-medium">{anime.uploaded}</p>}
      </div>
    </div>
  )
}

export function AnimeFilterPage({ navigate }) {
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState([])
  const [filters, setFilters] = useState({ title: '', status: '', type: '', order: 'title', genre: [] })

  const genreList = [
    {id:'fantasy',name:'Fantasy'},{id:'action',name:'Action'},{id:'adventure',name:'Adventure'},
    {id:'comedy',name:'Comedy'},{id:'shounen',name:'Shounen'},{id:'school',name:'School'},
    {id:'romance',name:'Romance'},{id:'drama',name:'Drama'},{id:'supernatural',name:'Supernatural'},
    {id:'isekai',name:'Isekai'},{id:'sci-fi',name:'Sci-Fi'},{id:'seinen',name:'Seinen'},
    {id:'reincarnation',name:'Reincarnation'},{id:'super-power',name:'Super Power'},
    {id:'historical',name:'Historical'},{id:'mystery',name:'Mystery'},{id:'harem',name:'Harem'},
    {id:'ecchi',name:'Ecchi'},{id:'slice-of-life',name:'Slice of Life'},{id:'sports',name:'Sports'}
  ]

  const applyFilter = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.title) params.append('title', filters.title)
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      params.append('order', filters.order || 'title')
      filters.genre.forEach(g => params.append('genre', g))
      if (page > 1) params.append('page', page)
      const res = await fetch(`/api/anime/filter?${params}`)
      const data = await res.json()
      setAnimeList(data.data || [])
      setPagination(data.pagination || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const toggleGenre = (id) => {
    setFilters(prev => ({
      ...prev,
      genre: prev.genre.includes(id) ? prev.genre.filter(g => g !== id) : [...prev.genre, id]
    }))
  }

  return (
    <div className="relative overflow-hidden flex-grow fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white tracking-tight mb-2">
              Database <span className="text-primary">Anime</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Filter ribuan judul anime berdasarkan preferensi Anda.</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-bold hover:border-primary hover:text-primary transition-all shadow-sm flex items-center gap-2 active:scale-95">
            <i className="ph-bold ph-funnel"></i> {showFilters ? 'Tutup Filter' : 'Filter & Genre'}
          </button>
        </div>

        {showFilters && (
          <div className="mb-10 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { label: 'Cari Judul', type: 'text', key: 'title', placeholder: 'Ketik nama anime...' },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                  <input type={field.type} value={filters[field.key]} onChange={e => setFilters(p => ({...p, [field.key]: e.target.value}))} placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary text-sm font-bold text-slate-700 dark:text-slate-300" />
                </div>
              ))}
              {[
                { label: 'Status', key: 'status', options: [['','Semua'],['Currently Airing','Currently Airing'],['Finished Airing','Finished Airing']] },
                { label: 'Tipe', key: 'type', options: [['','Semua'],['TV','TV'],['Movie','Movie'],['OVA','OVA'],['ONA','ONA'],['Special','Special']] },
                { label: 'Urutan', key: 'order', options: [['title','A-Z'],['titlereverse','Z-A'],['update','Update Terbaru'],['latest','Baru Ditambahkan'],['popular','Populer']] },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                  <select value={filters[field.key]} onChange={e => setFilters(p => ({...p, [field.key]: e.target.value}))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary text-sm font-bold text-slate-700 dark:text-slate-300">
                    {field.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Genre Pilihan</label>
              <div className="flex flex-wrap gap-2">
                {genreList.map(g => (
                  <button key={g.id} onClick={() => toggleGenre(g.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filters.genre.includes(g.id) ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={() => applyFilter()} className="w-full md:w-auto px-10 py-4 bg-secondary text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                Terapkan Filter
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : animeList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {animeList.map((anime, i) => <AnimeCard key={i} anime={anime} navigate={navigate} />)}
            </div>
            {pagination.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-10">
                {pagination.map((p, i) => (
                  <button key={i} onClick={() => p.pageNum && applyFilter(parseInt(p.pageNum))}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${p.isCurrent ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'}`}>
                    {p.text}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <i className="ph-bold ph-funnel text-5xl mb-4 text-slate-300"></i>
            <p className="font-bold">Gunakan filter di atas untuk mencari anime.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function AnimeSchedulePage({ navigate }) {
  const dayList = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
  const dayLabels = { monday:'Senin', tuesday:'Selasa', wednesday:'Rabu', thursday:'Kamis', friday:'Jumat', saturday:'Sabtu', sunday:'Minggu' }
  const daysMap = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  const currentDay = daysMap[new Date().getDay()]
  const [selectedDay, setSelectedDay] = useState(currentDay)
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/anime/schedule?day=${selectedDay}`)
      .then(r => r.json())
      .then(data => { setSchedule(data.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selectedDay])

  return (
    <div className="relative overflow-hidden flex-grow fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white tracking-tight mb-2">
            Jadwal <span className="text-primary">Rilis Anime</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Jadwal tayang anime mingguan.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 justify-center md:justify-start">
          {dayList.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all ${selectedDay === day ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50 hover:text-primary'}`}>
              {dayLabels[day]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800"></div>
                <div className="p-3 space-y-2"><div className="h-3 bg-slate-100 dark:bg-slate-700 rounded"></div></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {schedule.map((item, i) => (
              <div key={i} onClick={() => navigate(`/anime/detail/${item.slug}`)}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.pic_url || ''} alt={item.animeTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-xs md:text-sm text-secondary dark:text-white line-clamp-2 group-hover:text-primary transition-colors">{item.animeTitle}</h3>
                  <p className="text-[9px] md:text-[10px] text-slate-400 mt-1 font-medium">{item.time}</p>
                </div>
              </div>
            ))}
            {schedule.length === 0 && <p className="col-span-full text-center text-slate-500 py-20">Tidak ada jadwal untuk hari ini.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export function AnimeDetailPage({ navigate, path }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!path) return
    setLoading(true)
    fetch(`/api/anime/detail/${path}`)
      .then(r => r.json())
      .then(data => { if (data.success) setDetail(data.data); else setError('Gagal memuat detail anime.'); setLoading(false) })
      .catch(() => { setError('Terjadi kesalahan.'); setLoading(false) })
  }, [path])

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-24 fade-in">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-72 shrink-0"><div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse"></div></div>
        <div className="flex-grow space-y-4">
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse w-3/4"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2"></div>
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>
  if (!detail) return null

  return (
    <div className="relative min-h-screen fade-in">
      <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden -z-10">
        <img src={detail.thumb} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8fafc] dark:to-slate-950"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-24">
        <div className="mb-8">
          <button onClick={() => navigate('/anime')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all group">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 group-hover:border-primary/30 shadow-sm">
              <i className="ph-bold ph-arrow-left"></i>
            </div>
            Kembali ke Daftar
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4]">
                <img src={detail.thumb} alt={detail.title} className="w-full h-full object-cover" />
                {detail.rating && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between shadow-lg">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                    <div className="flex items-center gap-1 text-primary">
                      <i className="ph-fill ph-star text-amber-400"></i>
                      <span className="font-bold text-sm text-secondary">{detail.rating}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 space-y-4">
                {Object.keys(detail.info || {}).map(key => (
                  <div key={key} className="flex justify-between items-start gap-4 p-3 bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{key}</span>
                    <span className="text-xs font-bold text-secondary dark:text-white text-right">{detail.info[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-grow space-y-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-secondary dark:text-white tracking-tight mb-4 leading-tight">{detail.title}</h1>
              <div className="flex flex-wrap gap-2">
                {detail.genres?.map(genre => (
                  <span key={genre} className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">{genre}</span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h3 className="text-lg font-black text-secondary dark:text-white mb-4 flex items-center gap-2">
                <i className="ph-bold ph-text-align-left text-primary"></i> Sinopsis
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm whitespace-pre-line">{detail.synopsis}</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-secondary dark:text-white flex items-center gap-3">
                <i className="ph-bold ph-list-numbers text-primary"></i> Daftar Episode
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {detail.episodes?.map((ep, i) => (
                  <button key={i} onClick={() => navigate(`/anime/${ep.isEpisode ? 'stream' : 'detail'}/${ep.slug}`)}
                    className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer w-full text-left">
                    <div className="flex items-center gap-5 overflow-hidden">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                        <span className="text-sm font-black">{ep.eps}</span>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm truncate group-hover:text-primary transition-colors">{ep.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{ep.date}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all shrink-0">
                      <i className="ph-bold ph-caret-right"></i>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AnimeStreamPage({ navigate, path }) {
  const [stream, setStream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playerLoading, setPlayerLoading] = useState(false)
  const [playerContent, setPlayerContent] = useState(null)
  const [activeServer, setActiveServer] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!path) return
    setLoading(true)
    fetch(`/api/anime/stream/${path}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStream(data.data)
          if (data.data.servers?.length > 0) loadServer(data.data.servers[0])
        } else setError('Gagal memuat stream.')
        setLoading(false)
      })
      .catch(() => { setError('Terjadi kesalahan.'); setLoading(false) })
  }, [path])

  const loadServer = async (server) => {
    setActiveServer(server.name)
    setPlayerLoading(true)
    setPlayerContent(null)
    try {
      const res = await fetch('/api/anime/player', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: server.post, nume: server.nume, type: server.type })
      })
      const data = await res.json()
      setPlayerContent(data)
    } catch (err) { console.error(err) }
    finally { setPlayerLoading(false) }
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-10 fade-in">
      <div className="aspect-video bg-slate-900 rounded-3xl animate-pulse mb-6"></div>
      <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/2 animate-pulse"></div>
    </div>
  )

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>
  if (!stream) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pb-24 fade-in">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all group">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 group-hover:border-primary/30 shadow-sm">
            <i className="ph-bold ph-arrow-left"></i>
          </div>
          Kembali
        </button>
      </div>

      {/* Player */}
      <div className="mb-8 bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center">
        {playerLoading ? (
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-sm font-bold">Memuat player...</p>
          </div>
        ) : playerContent ? (
          playerContent.type === 'video' ? (
            <video src={playerContent.content} controls className="w-full h-full" autoPlay />
          ) : playerContent.type === 'iframe' ? (
            <iframe src={playerContent.content} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: playerContent.content }} className="w-full h-full" />
          )
        ) : (
          <div className="text-slate-400 text-center">
            <i className="ph-bold ph-play-circle text-5xl mb-3"></i>
            <p className="text-sm">Pilih server untuk memulai streaming</p>
          </div>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-secondary dark:text-white mb-6">{stream.title}</h1>

      {/* Navigation */}
      <div className="flex gap-3 mb-8">
        {stream.prevEps && (
          <button onClick={() => navigate(`/anime/stream/${stream.prevEps}`)} className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm hover:border-primary hover:text-primary transition-all">
            <i className="ph-bold ph-caret-left"></i> Prev
          </button>
        )}
        {stream.nextEps && (
          <button onClick={() => navigate(`/anime/stream/${stream.nextEps}`)} className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm hover:border-primary hover:text-primary transition-all">
            Next <i className="ph-bold ph-caret-right"></i>
          </button>
        )}
      </div>

      {/* Servers */}
      <div className="mb-10">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Server</h3>
        <div className="flex flex-wrap gap-2">
          {stream.servers?.map((server, i) => (
            <button key={i} onClick={() => loadServer(server)}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeServer === server.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50 hover:text-primary'}`}>
              {server.name}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads */}
      {stream.downloads?.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Download</h3>
          <div className="space-y-4">
            {stream.downloads.map((dl, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-black text-secondary dark:text-white mb-4">{dl.format}</h4>
                <div className="space-y-3">
                  {dl.items?.map((item, j) => (
                    <div key={j} className="flex items-center justify-between gap-4 flex-wrap">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.resolution}</span>
                      <div className="flex gap-2 flex-wrap">
                        {item.links?.map((link, k) => (
                          <a key={k} href={link.link} target="_blank" className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:border-primary hover:text-primary transition-all">
                            {link.server}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Episode List */}
      {stream.episodes?.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Episode Lainnya</h3>
          <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
            {stream.episodes.map((ep, i) => (
              <button key={i} onClick={() => navigate(`/anime/stream/${ep.slug}`)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all w-full text-left ${ep.slug === path ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30'}`}>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{ep.title}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">{ep.date}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
