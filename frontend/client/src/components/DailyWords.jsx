import React, { useState, useEffect } from 'react'

const DailyWords = ({ isDark }) => {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [justUpdated, setJustUpdated] = useState(false)

  // modal state
  const [selectedWord, setSelectedWord] = useState(null)
  const closeModal = () => setSelectedWord(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://upsc-vocab-builder.onrender.com/daily-word')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setWords(Array.isArray(data) ? data.slice(0, 4) : [])
      return true
    } catch (err) {
      setError(err.message || 'Failed to load daily words')
      return false
    } finally {
      setLoading(false)
    }
  }

  // wrapper to trigger refresh microinteraction without duplicating fetch logic
  const handleRefresh = async () => {
    if (loading) return
    const success = await fetchData()
    if (success) {
      setJustUpdated(true)
      setTimeout(() => setJustUpdated(false), 1000)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <section className={`py-10 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <style>{`@keyframes dailyWordsModalIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">Editor's Pick</span>
            <h2 className={`${isDark ? 'mt-3 text-3xl font-extrabold text-white' : 'mt-3 text-3xl font-extrabold text-slate-900'}`}>Today's Editorial Picks</h2>
            <p className={`${isDark ? 'mt-2 text-sm text-slate-400 max-w-xl' : 'mt-2 text-sm text-slate-500 max-w-xl'}`}>High-impact vocabulary curated daily for serious UPSC aspirants.</p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span>Refreshed Daily</span>
              </div>

              {/* Polished Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                aria-label="Refresh words"
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ease-out transform ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 hover:scale-105'} ${isDark ? 'bg-slate-800/50 text-white backdrop-blur-sm' : 'bg-white/70 text-slate-900 backdrop-blur-sm'} shadow-sm border border-transparent`}
                style={{ boxShadow: justUpdated ? '0 6px 32px rgba(56,189,248,0.12)' : undefined }}
                title="Fetch fresh daily words"
              >
                <span className={`absolute -inset-px rounded-full pointer-events-none transition-opacity ${justUpdated ? 'opacity-100' : 'opacity-0'}`} style={{ boxShadow: '0 8px 30px rgba(56,189,248,0.06)' }} />

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={`h-4 w-4 text-cyan-400 ${loading ? 'animate-spin' : 'transition-transform'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                </svg>

                <span className="flex items-center gap-2">
                  <span>Refresh Words</span>
                  <span className={`ml-1 text-xs font-semibold text-cyan-300 transition-opacity ${justUpdated ? 'opacity-100' : 'opacity-0'}`}>Updated</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`${isDark ? 'rounded-2xl p-6 bg-slate-900/60 border border-slate-800/70' : 'rounded-2xl p-6 bg-slate-100/90 border border-slate-200'} backdrop-blur-md animate-pulse`}
              />
            ))}
          </div>
        ) : error ? (
          <div className={`${isDark ? 'rounded-2xl p-6 bg-red-900/30 border border-red-800' : 'rounded-2xl p-6 bg-red-50 border border-red-200'}`}>
            <p className={`${isDark ? 'text-red-200' : 'text-red-700'}`}>Error: {error}</p>
            <button onClick={fetchData} className="mt-3 inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition">Retry</button>
          </div>
        ) : (
          <>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-stretch">
              {words.map((w, idx) => (
                // card click handler: open modal with full details
                <article
                  key={w.id ?? idx}
                  onClick={() => setSelectedWord(w)}
                  className={`relative flex flex-col h-full rounded-2xl p-6 ${isDark ? 'bg-slate-900/80 border border-slate-800/70' : 'bg-white/90 border border-slate-200'} backdrop-blur-md transform transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(14,165,233,0.08)] hover:ring-1 hover:ring-cyan-400/30 cursor-pointer`}
                  style={{ boxShadow: '0 8px 30px rgba(2,6,23,0.28)' }}
                >
                  <div className="flex items-start justify-between">
                    <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} text-2xl font-extrabold leading-tight break-words`}>{w.word}</h3>
                    <span className="ml-3 inline-flex items-center rounded-full px-3 h-8 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-md flex-nowrap">{w.difficulty}</span>
                  </div>

                  <div className={`${isDark ? 'mt-3 text-sm text-cyan-300' : 'mt-3 text-sm text-cyan-400'}`}>{w.pronunciation}</div>

                  <div className="mt-4 flex-1">
                    <p className={`${isDark ? 'text-slate-200' : 'text-slate-700'} text-sm line-clamp-3`}>{w.meaning}</p>
                  </div>

                  <div className={`mt-6 flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="capitalize">{w.category}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(`${w.word} - ${w.meaning}`) }}
                      className={`inline-flex items-center h-9 px-3 rounded-md text-sm font-medium text-indigo-400 bg-transparent border border-transparent ${isDark ? 'hover:bg-white/3 hover:text-indigo-200' : 'hover:bg-slate-100 hover:text-indigo-600'} transition`}
                      aria-label="Copy"
                    >
                      Copy
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button className={`${isDark ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-400 hover:text-cyan-300'} text-sm font-medium transition`}>View All Words →</button>
            </div>
            {/* modal JSX */}
            {selectedWord && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={closeModal}
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

                <div
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
                  className={`relative w-full max-w-2xl rounded-2xl p-6 shadow-xl transform transition-all ${isDark ? 'bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-slate-700 text-white' : 'bg-white/95 border border-slate-200 text-slate-950'}`}
                  style={{ animation: 'dailyWordsModalIn 240ms ease-out forwards' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-extrabold">{selectedWord.word}</h3>
                      <p className="mt-1 text-sm text-cyan-300">{selectedWord.pronunciation}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      aria-label="Close"
                      className={`ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md transition ${isDark ? 'bg-slate-800/60 hover:bg-slate-700/60' : 'bg-slate-100/90 hover:bg-slate-200/90'}`}
                    >
                      <svg className="h-4 w-4 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className={`${isDark ? 'text-slate-300' : 'text-slate-800'} text-sm`}>{selectedWord.meaning}</p>
                      {selectedWord.etymology && (
                        <div className="mt-3">
                          <p className={`${isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}`}>Etymology</p>
                          <p className={`${isDark ? 'mt-1 text-sm text-slate-300' : 'mt-1 text-sm text-slate-700'}`}>{selectedWord.etymology}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      {selectedWord.editorial_example && (
                        <div>
                          <p className={`${isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}`}>Editorial Example</p>
                          <p className={`${isDark ? 'mt-1 text-sm italic text-slate-300' : 'mt-1 text-sm italic text-slate-700'}`}>"{selectedWord.editorial_example}"</p>
                        </div>
                      )}

                      {selectedWord.synonyms && (
                        <div className="mt-3">
                          <p className={`${isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}`}>Synonyms</p>
                          <p className={`${isDark ? 'mt-1 text-sm text-slate-300' : 'mt-1 text-sm text-slate-700'}`}>{Array.isArray(selectedWord.synonyms) ? selectedWord.synonyms.join(', ') : selectedWord.synonyms}</p>
                        </div>
                      )}

                      {selectedWord.antonyms && (
                        <div className="mt-3">
                          <p className={`${isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}`}>Antonyms</p>
                          <p className={`${isDark ? 'mt-1 text-sm text-slate-300' : 'mt-1 text-sm text-slate-700'}`}>{Array.isArray(selectedWord.antonyms) ? selectedWord.antonyms.join(', ') : selectedWord.antonyms}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`mt-6 flex items-center justify-between text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div className="capitalize">{selectedWord.category}</div>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white">{selectedWord.difficulty}</div>
                      <button
                        onClick={() => navigator.clipboard?.writeText(`${selectedWord.word} - ${selectedWord.meaning}`)}
                        className={`inline-flex items-center h-9 px-3 rounded-md text-sm font-medium bg-transparent border border-transparent ${isDark ? 'text-indigo-200 hover:bg-white/5' : 'text-indigo-700 hover:bg-slate-100'} transition`}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default DailyWords
