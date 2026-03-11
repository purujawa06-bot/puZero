export default function CategoryPage({ navigate }) {
  const btn = (href, label) => (
    <button
      onClick={() => navigate(href)}
      className="w-full flex items-center justify-between p-3.5 md:p-4 rounded-xl bg-slate-50 hover:bg-primary hover:text-white transition-all group/item shadow-sm cursor-pointer"
    >
      <span className="text-sm font-bold">{label}</span>
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/item:translate-x-1 transition-transform">
        <i className="ph-bold ph-caret-right text-xs"></i>
      </div>
    </button>
  )

  const categories = [
    {
      icon: 'ph-bold ph-download-simple', bg: 'bg-blue-50', text: 'text-blue-500',
      hoverBg: 'group-hover:bg-blue-500', border: 'border-b-blue-500',
      title: 'Downloader',
      items: [
        ['/youtube', 'YouTube'],
        ['/instagram', 'Instagram'],
        ['/tiktok', 'TikTok'],
        ['/soundcloud', 'SoundCloud'],
      ]
    },
    {
      icon: 'ph-bold ph-brain', bg: 'bg-purple-50', text: 'text-purple-500',
      hoverBg: 'group-hover:bg-purple-500', border: 'border-b-purple-500',
      title: 'AI (Chat)',
      items: [['/ai', 'Gemini 3 Flash']]
    },
    {
      icon: 'ph-bold ph-video-camera', bg: 'bg-rose-50', text: 'text-rose-500',
      hoverBg: 'group-hover:bg-rose-500', border: 'border-b-rose-500',
      title: 'AI-Video',
      items: [['/tools/dubbing', 'AI Dubbing']]
    },
    {
      icon: 'ph-bold ph-image', bg: 'bg-indigo-50', text: 'text-indigo-500',
      hoverBg: 'group-hover:bg-indigo-500', border: 'border-b-indigo-500',
      title: 'AI-Image',
      items: [['/tools/upscale', 'Upscale Image'], ['/tools/ghibli', 'Ghibli Filter']]
    },
  ]

  return (
    <div className="relative overflow-hidden flex-grow fade-in pb-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-secondary dark:text-white tracking-tight mb-3 md:mb-4">
            Pilih <span className="text-primary">Layanan</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium">Silakan pilih kategori alat yang ingin Anda gunakan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <div key={i} className={`bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border-b-4 border-b-slate-200/50 hover:${cat.border}`}>
              <div className={`w-14 h-14 md:w-16 md:h-16 ${cat.bg} ${cat.text} rounded-2xl flex items-center justify-center mb-5 md:mb-6 text-2xl md:text-3xl ${cat.hoverBg} group-hover:text-white transition-colors duration-300`}>
                <i className={cat.icon}></i>
              </div>
              <h3 className="text-lg md:text-xl font-black text-secondary dark:text-white mb-3 md:mb-4">{cat.title}</h3>
              <div className="space-y-2.5">
                {cat.items.map(([href, label]) => btn(href, label))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
