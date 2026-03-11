export default function HomePage({ navigate }) {
  return (
    <div className="relative flex-grow flex items-center justify-center overflow-hidden min-h-[80dvh]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/15 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <img src="/favicon.jpg" alt="PuZero Logo" className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[2rem] shadow-2xl border-4 border-white object-cover" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 text-slate-600 text-xs sm:text-sm font-bold mb-8 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          All-in-One AI Productivity Hub
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-secondary dark:text-white tracking-tight mb-6 md:mb-8 leading-[1.15] md:leading-[1.1]">
          Optimalkan Pekerjaan <br className="hidden sm:block" />
          Dengan <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">PuZero AI.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-500 mb-10 md:mb-12 leading-relaxed font-medium px-2">
          Platform serba guna yang dirancang untuk membantu Anda mengunduh media, mengolah data, dan meningkatkan produktivitas menggunakan teknologi AI terbaru.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
          <button
            onClick={() => navigate('/category')}
            className="w-full sm:w-auto cursor-pointer px-8 py-4 sm:py-5 bg-secondary text-white rounded-2xl font-black text-base sm:text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200/50 flex items-center justify-center gap-3 active:scale-95 group"
          >
            Mulai Sekarang
            <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          <button
            onClick={() => navigate('/features')}
            className="w-full sm:w-auto cursor-pointer px-8 py-4 sm:py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-base sm:text-lg hover:border-primary/30 hover:bg-slate-50 hover:text-primary transition-all active:scale-95 flex items-center justify-center"
          >
            Pelajari Fitur
          </button>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 opacity-70 hover:opacity-100 transition-opacity duration-500 max-w-4xl mx-auto">
          {[
            { icon: 'ph-bold ph-lightning', color: 'text-amber-500', label: 'Fast Speed' },
            { icon: 'ph-bold ph-shield-check', color: 'text-emerald-500', label: 'Secure' },
            { icon: 'ph-bold ph-infinity', color: 'text-blue-500', label: 'Unlimited' },
            { icon: 'ph-bold ph-currency-circle-dollar', color: 'text-primary', label: '100% Free' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <i className={`${item.icon} text-2xl md:text-3xl ${item.color}`}></i>
              </div>
              <span className="font-bold text-[10px] md:text-xs text-slate-600 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
