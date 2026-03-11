import { useState, useEffect, useRef } from 'react'
import BackButton from '../components/BackButton'

export default function AIPage({ navigate }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyTo, setReplyTo] = useState('')
  const [userId] = useState(() => localStorage.getItem('puzero_user_id') || ('user-' + Math.random().toString(36).substring(2, 15)))
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const hist = JSON.parse(localStorage.getItem('puzero_chat_history') || '[]')
    const sys = localStorage.getItem('puzero_system_prompt') || 'Kamu adalah AI asisten dari PuZero yang ramah dan membantu.'
    setMessages(hist)
    setSystemPrompt(sys)
    localStorage.setItem('puzero_user_id', userId)
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveHistory = (hist, sys) => {
    const trimmed = hist.slice(-20)
    localStorage.setItem('puzero_chat_history', JSON.stringify(trimmed))
    if (sys !== undefined) localStorage.setItem('puzero_system_prompt', sys)
  }

  const sendMessage = async () => {
    const prompt = input.trim()
    if (!prompt || loading) return

    const userMsg = { role: 'user', text: prompt, replyTo }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setReplyTo('')
    setLoading(true)

    try {
      const finalPrompt = replyTo ? `[Replying to: ${replyTo}]\n\n${prompt}` : prompt
      const res = await fetch('https://puruboy-api.vercel.app/api/ai/puruai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: userId, prompt: finalPrompt, model: 'puruboy-flash', system: systemPrompt })
      })
      const data = await res.json()
      if (!data.success) throw new Error('Gagal mendapatkan respon')
      const aiText = data.result[0].parts[0].text
      const aiMsg = { role: 'model', text: aiText }
      const finalMessages = [...newMessages, aiMsg]
      setMessages(finalMessages)
      saveHistory(finalMessages, systemPrompt)
    } catch (err) {
      const errMsg = { role: 'error', text: err.message }
      setMessages([...newMessages, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    if (confirm('Mulai chat baru? Riwayat chat ini akan dihapus.')) {
      setMessages([])
      setReplyTo('')
      saveHistory([], systemPrompt)
    }
  }

  const renderMarkdown = (text) => {
    if (typeof window.marked !== 'undefined') return window.marked.parse(text)
    return text.replace(/\n/g, '<br/>')
  }

  return (
    <div className="max-w-4xl mx-auto h-[100dvh] flex flex-col bg-[#f8fafc] dark:bg-slate-950 fade-in relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate('/category')}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all border border-slate-100 dark:border-slate-700"
          >
            <i className="ph-bold ph-arrow-left text-lg md:text-xl"></i>
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black text-secondary dark:text-white tracking-tight">Gemini 3 Flash</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="px-3 md:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2 active:scale-95 shadow-sm"
        >
          <i className="ph-bold ph-plus"></i> <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto px-4 sm:px-6 py-6 space-y-6 pb-32">
        {messages.length === 0 && (
          <div className="text-center py-12 md:py-20 max-w-lg mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-primary/10 to-accent/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-6 border border-white shadow-sm">
              <i className="ph-fill ph-brain text-3xl md:text-4xl"></i>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-secondary dark:text-white tracking-tight">Apa yang bisa saya bantu?</h2>
            <p className="text-slate-500 text-sm md:text-base mt-3 leading-relaxed">Tanyakan apapun, mulai dari coding, penulisan kreatif, hingga ringkasan data kompleks.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' && (
              <div className="flex flex-col items-end space-y-1.5 group w-full">
                <div className="max-w-[90%] md:max-w-[80%] bg-primary text-white p-3.5 md:p-4 rounded-2xl rounded-tr-sm shadow-sm">
                  {msg.replyTo && <div className="text-[10px] opacity-70 border-l-2 border-white/40 pl-2 mb-2 italic truncate">Replying: {msg.replyTo.substring(0, 50)}...</div>}
                  <p className="text-sm md:text-base whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              </div>
            )}
            {msg.role === 'model' && (
              <div className="flex flex-col items-start space-y-1.5 group w-full">
                <div className="max-w-[95%] md:max-w-[85%] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 p-4 md:p-5 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-tr from-primary to-accent rounded-[0.4rem] flex items-center justify-center shrink-0">
                      <i className="ph-fill ph-lightning text-white text-[10px]"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PuZero AI</span>
                  </div>
                  <div
                    className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto break-words"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                  />
                </div>
                <button
                  onClick={() => setReplyTo(msg.text.replace(/\n/g, ' '))}
                  className="text-[10px] text-slate-400 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider ml-2 flex items-center gap-1"
                >
                  <i className="ph-bold ph-arrow-u-up-left"></i> Reply
                </button>
              </div>
            )}
            {msg.role === 'error' && (
              <div className="p-3 text-red-500 text-xs md:text-sm bg-red-50 rounded-xl max-w-[80%] border border-red-100">❌ Error: {msg.text}</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
              <i className="ph-bold ph-lightning text-slate-400"></i>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none w-24 shadow-sm">
              <div className="flex gap-1.5 justify-center">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#f8fafc] dark:from-slate-950 via-[#f8fafc] dark:via-slate-950 to-transparent shrink-0">
        <div className="max-w-3xl mx-auto">
          {replyTo && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-b-0 rounded-t-2xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <i className="ph-bold ph-arrow-u-up-left text-primary shrink-0"></i>
                <p className="text-xs text-slate-500 italic truncate font-medium">{replyTo.substring(0, 80)}...</p>
              </div>
              <button onClick={() => setReplyTo('')} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                <i className="ph-bold ph-x-circle text-lg"></i>
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-2 md:p-3 transition-all focus-within:border-primary/40">
            <div className="flex flex-col gap-2">
              <details className="group px-2">
                <summary className="list-none cursor-pointer flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors select-none">
                  <i className="ph-bold ph-gear text-sm transition-transform group-open:rotate-90"></i> Custom Instructions
                </summary>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full mt-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 text-xs md:text-sm focus:outline-none focus:border-primary/30 transition-colors text-slate-700 dark:text-slate-300"
                  rows="2"
                  placeholder="Contoh: Jawab dalam bahasa gaul..."
                />
              </details>
              <div className="flex items-end gap-2 px-2 pb-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 && !e.shiftKey) { e.preventDefault(); sendMessage() }
                  }}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300 text-base md:text-sm py-2 resize-none max-h-32 overflow-y-auto placeholder:text-slate-400 outline-none"
                  rows="1"
                  placeholder="Ketik pesan di sini..."
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="w-10 h-10 md:w-12 md:h-12 bg-secondary text-white rounded-xl flex items-center justify-center hover:bg-primary transition-all shadow-md active:scale-90 shrink-0 mb-1 disabled:opacity-50"
                >
                  <i className="ph-bold ph-paper-plane-right text-lg md:text-xl"></i>
                </button>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">AI can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  )
}
