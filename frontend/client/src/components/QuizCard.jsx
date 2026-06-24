import React, { useState, useEffect } from 'react'

const QuizCard = ({ isDark = false }) => {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const loadQuiz = async () => {
    setLoading(true)
    setError('')
    setQuiz(null)
    setSelectedOption('')
    setSubmitted(false)
    setIsCorrect(false)

    try {
      const response = await fetch('https://upsc-vocab-builder.onrender.com/quiz/random')
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      setQuiz(data)
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load quiz question.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuiz()
  }, [])

  const handleOptionClick = (option) => {
    if (submitted) return
    setSelectedOption(option)
  }

  const handleSubmit = () => {
    if (!quiz || !selectedOption) return
    setIsCorrect(selectedOption === quiz.correct_option)
    setSubmitted(true)
  }

  const getOptionClasses = (option) => {
    const base = 'w-full rounded-2xl border px-4 py-4 text-left text-sm font-medium transition duration-200'
    const light = 'bg-slate-50 border-slate-200 text-slate-900 hover:border-cyan-400 hover:bg-cyan-50'
    const dark = 'bg-slate-900 border-slate-700 text-slate-100 hover:border-cyan-400 hover:bg-slate-800'
    const selected = isDark ? 'bg-cyan-500/15 border-cyan-500/40' : 'bg-cyan-500/10 border-cyan-500/30'
    const correct = isDark ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-emerald-500/10 border-emerald-400 text-emerald-900'
    const wrong = isDark ? 'bg-rose-500/15 border-rose-400 text-rose-200' : 'bg-rose-500/10 border-rose-400 text-rose-950'

    if (submitted) {
      if (option === quiz.correct_option) {
        return `${base} ${correct}`
      }
      if (option === selectedOption && option !== quiz.correct_option) {
        return `${base} ${wrong}`
      }
      return `${base} ${isDark ? dark : light}`
    }

    if (option === selectedOption) {
      return `${base} ${selected}`
    }

    return `${base} ${isDark ? dark : light}`
  }

  return (
    <section className={`mt-10 rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl transition duration-300 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-100'}`}>
            Quiz Practice
          </span>
          <h2 className={`mt-4 text-2xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Word Quiz
          </h2>
          <p className={`mt-2 max-w-2xl text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Answer the question and see your result instantly. Tap Next Question for another prompt.
          </p>
        </div>

        <button
          type="button"
          onClick={loadQuiz}
          disabled={loading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'} ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          Next Question
        </button>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          <div className={`h-12 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} animate-pulse`} />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`h-16 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} animate-pulse`} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className={`mt-8 rounded-3xl border p-5 ${isDark ? 'border-rose-600/40 bg-rose-500/10 text-rose-100' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>
          <p className="font-medium">Unable to load quiz:</p>
          <p className="mt-2 text-sm">{error}</p>
          <button
            type="button"
            onClick={loadQuiz}
            className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${isDark ? 'bg-rose-500 text-white hover:bg-rose-400' : 'bg-rose-600 text-white hover:bg-rose-500'}`}
          >
            Try Again
          </button>
        </div>
      ) : quiz ? (
        <div className="mt-8 space-y-6">
          <div className={`rounded-[1.75rem] border p-6 ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'}`}>
            <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
              Question
            </p>
            <p className={`mt-3 text-xl leading-8 ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>
              {quiz.question}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {quiz.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={getOptionClasses(option)}
                disabled={submitted}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption || submitted}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${selectedOption && !submitted ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-95' : isDark ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              Submit
            </button>

            {submitted && (
              <div className={`rounded-2xl px-4 py-3 font-semibold ${isCorrect ? (isDark ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30' : 'bg-emerald-500/10 text-emerald-900 border border-emerald-200') : (isDark ? 'bg-rose-500/15 text-rose-200 border border-rose-400/30' : 'bg-rose-500/10 text-rose-900 border border-rose-200')}`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default QuizCard