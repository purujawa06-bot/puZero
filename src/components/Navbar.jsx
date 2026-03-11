import { useState } from 'react'

export default function Navbar({ navigate, darkMode, toggleDarkMode, currentPath }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLink = (href, label, icon) => {
    const isActive = window.location.pathname === href
    return (
      <a
        onClick={(e) => { e.preventDefault(); navigate(href); setMobileOpen(false) }}
        href={href}
        className={`cursor-pointer px-4 py-2.5 rounded-xl font-bold transition-all text-sm lg:text-base ${isActive ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/10'}`}
      >
        {label}
      </a>
    )
  }

  const mobileNavLink = (href, label, iconClass) => (
    <a
      onClick={(e) => { e.preventDefault(); navigate(href); setMobileOpen(false) }}
      href={href}
      className="cursor-pointer block px-5 py-3.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary font-bold transition-colors flex items-center gap-3"
    >
      <i className={`${iconClass} text-xl text-slate-400`}></i> {label}
    </a>
  )

  return (
    <nav className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[100] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 group-hover:scale-105 transition-all duration-300">
              <i className="ph-bold ph-lightning text-white text-lg md:text-xl"></i>
            </div>
            <span className="text-xl md:text-2xl font-extrabold text-secondary dark:text-white tracking-tight">
              Pu<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Zero</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLink('/', 'Home')}
            {navLink('/category', 'Tools')}
            {navLink('/anime', 'Latest')}
            {navLink('/anime/filter', 'Daftar')}
            {navLink('/anime/schedule', 'Jadwal')}

            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-all border border-slate-100 dark:border-slate-700"
            >
              <i className={`ph-bold ${darkMode ? 'ph-sun' : 'ph-moon'} text-xl`}></i>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-all border border-slate-100 dark:border-slate-700"
            >
              <i className={`ph-bold ${darkMode ? 'ph-sun' : 'ph-moon'} text-xl`}></i>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary focus:outline-none transition-all active:scale-95 border border-slate-100 dark:border-slate-700"
            >
              <i className={`ph-bold ${mobileOpen ? 'ph-x' : 'ph-list'} text-2xl transition-transform duration-300`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-2xl transition-all duration-300 md:hidden overflow-hidden ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 space-y-1">
          {mobileNavLink('/', 'Home', 'ph-bold ph-house')}
          {mobileNavLink('/category', 'Tools', 'ph-bold ph-wrench')}
          {mobileNavLink('/anime', 'Anime', 'ph-bold ph-television')}
          {mobileNavLink('/anime/filter', 'Daftar', 'ph-bold ph-magnifying-glass')}
          {mobileNavLink('/anime/schedule', 'Jadwal', 'ph-bold ph-calendar')}
        </div>
      </div>
    </nav>
  )
}
