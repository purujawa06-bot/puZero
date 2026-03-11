import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingBar from './components/LoadingBar'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import FeaturesPage from './pages/FeaturesPage'
import TosPage from './pages/TosPage'
import PrivacyPage from './pages/PrivacyPage'
import AnimePage from './pages/AnimePage'
import AnimeFilterPage from './pages/AnimeFilterPage'
import AnimeSchedulePage from './pages/AnimeSchedulePage'
import AnimeDetailPage from './pages/AnimeDetailPage'
import AnimeStreamPage from './pages/AnimeStreamPage'
import AIPage from './pages/AIPage'
import YouTubePage from './pages/YouTubePage'
import InstagramPage from './pages/InstagramPage'
import TikTokPage from './pages/TikTokPage'
import SoundCloudPage from './pages/SoundCloudPage'
import UpscalePage from './pages/UpscalePage'
import DubbingPage from './pages/DubbingPage'
import GhibliPage from './pages/GhibliPage'
import NotFoundPage from './pages/NotFoundPage'

function parseRoute(pathname) {
  if (pathname === '/') return { page: 'home', params: {} }
  if (pathname === '/category') return { page: 'category', params: {} }
  if (pathname === '/features') return { page: 'features', params: {} }
  if (pathname === '/tos') return { page: 'tos', params: {} }
  if (pathname === '/privacy') return { page: 'privacy', params: {} }
  if (pathname === '/ai') return { page: 'ai', params: {} }
  if (pathname === '/youtube') return { page: 'youtube', params: {} }
  if (pathname === '/instagram') return { page: 'instagram', params: {} }
  if (pathname === '/tiktok') return { page: 'tiktok', params: {} }
  if (pathname === '/soundcloud') return { page: 'soundcloud', params: {} }
  if (pathname === '/tools/upscale') return { page: 'upscale', params: {} }
  if (pathname === '/tools/dubbing') return { page: 'dubbing', params: {} }
  if (pathname === '/tools/ghibli') return { page: 'ghibli', params: {} }
  if (pathname === '/anime') return { page: 'anime', params: {} }
  if (pathname === '/anime/filter') return { page: 'anime-filter', params: {} }
  if (pathname.startsWith('/anime/filter')) return { page: 'anime-filter', params: {} }
  if (pathname === '/anime/schedule') return { page: 'anime-schedule', params: {} }
  const detailMatch = pathname.match(/^\/anime\/detail\/(.+)$/)
  if (detailMatch) return { page: 'anime-detail', params: { path: detailMatch[1] } }
  const streamMatch = pathname.match(/^\/anime\/stream\/(.+)$/)
  if (streamMatch) return { page: 'anime-stream', params: { path: streamMatch[1] } }
  return { page: '404', params: {} }
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname))
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setRoute(parseRoute(path))
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const handlePop = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
    setDarkMode(isDark)
  }

  const pageProps = { navigate, setLoading }

  const renderPage = () => {
    const { page, params } = route
    switch (page) {
      case 'home': return <HomePage {...pageProps} />
      case 'category': return <CategoryPage {...pageProps} />
      case 'features': return <FeaturesPage {...pageProps} />
      case 'tos': return <TosPage />
      case 'privacy': return <PrivacyPage />
      case 'ai': return <AIPage {...pageProps} />
      case 'youtube': return <YouTubePage {...pageProps} />
      case 'instagram': return <InstagramPage {...pageProps} />
      case 'tiktok': return <TikTokPage {...pageProps} />
      case 'soundcloud': return <SoundCloudPage {...pageProps} />
      case 'upscale': return <UpscalePage {...pageProps} />
      case 'dubbing': return <DubbingPage {...pageProps} />
      case 'ghibli': return <GhibliPage {...pageProps} />
      case 'anime': return <AnimePage {...pageProps} />
      case 'anime-filter': return <AnimeFilterPage {...pageProps} />
      case 'anime-schedule': return <AnimeSchedulePage {...pageProps} />
      case 'anime-detail': return <AnimeDetailPage {...pageProps} path={params.path} />
      case 'anime-stream': return <AnimeStreamPage {...pageProps} path={params.path} />
      default: return <NotFoundPage {...pageProps} />
    }
  }

  return (
    <div className={`bg-[#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-[100dvh] flex flex-col antialiased selection:bg-primary/20 selection:text-primary pb-safe`}>
      <LoadingBar loading={loading} />
      <Navbar navigate={navigate} darkMode={darkMode} toggleDarkMode={toggleDarkMode} currentPath={window.location.pathname} />
      <main className="flex-grow flex flex-col">
        <div className="fade-in flex-grow flex flex-col" key={window.location.pathname}>
          {renderPage()}
        </div>
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}
