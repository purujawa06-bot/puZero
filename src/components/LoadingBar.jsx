export default function LoadingBar({ loading }) {
  if (!loading) return null
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[200] pointer-events-none bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className="h-full bg-emerald-500 w-1/3 animate-loading-bar"></div>
    </div>
  )
}
