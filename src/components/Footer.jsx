export default function Footer({ navigate }) {
  const link = (href, label) => (
    <li>
      <a
        onClick={(e) => { e.preventDefault(); navigate(href) }}
        href={href}
        className="hover:text-primary transition-colors cursor-pointer"
      >
        {label}
      </a>
    </li>
  )

  return (
    <footer className="bg-secondary text-slate-400 py-10 md:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10 text-center sm:text-left">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <i className="ph-bold ph-lightning text-white"></i>
              </div>
              <span className="text-xl font-extrabold text-white">PuZero</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
              Platform serbaguna berbasis AI untuk meningkatkan alur kerja digital Anda secara gratis dengan UI yang modern dan responsif.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs">Tautan Cepat</h4>
            <ul className="text-sm space-y-2.5">
              {link('/features', 'Fitur Utama')}
              {link('/category', 'Kategori Tools')}
              {link('/ai', 'AI Chatbot')}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs">Legal & Privasi</h4>
            <ul className="text-sm space-y-2.5">
              {link('/tos', 'Syarat & Ketentuan')}
              {link('/privacy', 'Kebijakan Privasi')}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} <span className="text-white font-bold">PuZero</span>. All Rights Reserved.</p>
          <p>Made with <i className="ph-fill ph-heart text-accent"></i> by Puru Zero</p>
        </div>
      </div>
    </footer>
  )
}
