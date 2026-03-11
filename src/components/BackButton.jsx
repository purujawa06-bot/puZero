export default function BackButton({ navigate, to = '/category', label = 'Kembali ke Kategori' }) {
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all group"
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 group-hover:border-primary/30 group-hover:bg-primary/5 shadow-sm transition-all">
        <i className="ph-bold ph-arrow-left"></i>
      </div>
      {label}
    </button>
  )
}
