import React, { useState, useEffect } from "react";
import DailyWords from './components/DailyWords'

function App() {
  const [generatorInput, setGeneratorInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedWord, setGeneratedWord] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('theme-preference');
      if (storedTheme === 'light') return false;
      return true;
    }
    return true;
  });
  const [splashFading, setSplashFading] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [logoPulse, setLogoPulse] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const toggleTheme = () => setIsDark((current) => !current);

  useEffect(() => {
    window.localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const logoTimer = window.setTimeout(() => setLogoVisible(true), 120);
    const taglineTimer = window.setTimeout(() => setTaglineVisible(true), 900);
    const pulseTimer = window.setTimeout(() => setLogoPulse(true), 1900);
    const fadeTimer = window.setTimeout(() => setSplashFading(true), 3000);
    const contentTimer = window.setTimeout(() => setContentVisible(true), 3000);
    const hideTimer = window.setTimeout(() => setSplashHidden(true), 3300);

    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(taglineTimer);
      window.clearTimeout(pulseTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(contentTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const showSplash = !splashHidden;

  const splashStyle = 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white';
  const splashCardStyle = 'border border-white/10 bg-slate-950/90';

  const handleGenerateWord = async () => {
    if (!generatorInput.trim()) return;
    
    setIsLoading(true);

try {

  const response = await fetch("http://127.0.0.1:8000/ai-word", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      word: generatorInput,
    }),
  });

  const data = await response.json();

  console.log(data);

  setGeneratedWord(data);

} catch (error) {

  console.log(error);

} finally {

  setIsLoading(false);

}
  };



  return (
    <>
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-6 py-8 transition-all duration-700 ${splashFading ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${splashStyle}`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl opacity-80" />
            <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl opacity-60" />
          </div>

          <div className={`relative w-full max-w-2xl rounded-[2rem] border px-10 py-14 shadow-[0_40px_120px_rgba(15,23,42,0.35)] transition-all duration-700 ${splashCardStyle}`}>
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-cyan-300 to-indigo-500 text-5xl font-bold text-white shadow-[0_0_60px_rgba(56,189,248,0.25)]">
              CL
            </div>

            <div className={`text-center transition-all duration-700 ${logoVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'}`}>
              <h1 className="text-5xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text sm:text-6xl">
                CiviLex
              </h1>
            </div>

            <p className={`mx-auto mt-5 max-w-xl text-center text-base leading-8 text-slate-200 transition-all duration-700 ${taglineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              Master the Language of UPSC
            </p>

            <div className={`absolute inset-0 rounded-[2rem] ${logoPulse ? 'opacity-100 scale-[1.01]' : 'opacity-0 scale-100'} transition-all duration-1000`}>
              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>
          </div>
        </div>
      )}

      <div className={`min-h-screen transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${isDark ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-950'}`}>
        <header className={`border-b transition-all duration-300 ${isDark ? 'border-slate-800 bg-slate-900/50 backdrop-blur-xl' : 'border-slate-200/50 bg-white/80 backdrop-blur-xl'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-base font-semibold text-white shadow-lg shadow-cyan-500/20">
              UV
            </div>
            <div>
              <div className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>UPSC Vocab Builder</div>
              <div className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Master Editorial Vocabulary with AI</div>
            </div>
          </div>

          <nav className={`hidden items-center gap-6 text-sm transition-colors duration-300 md:flex ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <a className={`transition hover:${isDark ? 'text-white' : 'text-slate-950'}`}>Features</a>
            <a className={`transition hover:${isDark ? 'text-white' : 'text-slate-950'}`}>Insights</a>
            <a className={`transition hover:${isDark ? 'text-white' : 'text-slate-950'}`}>Library</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`rounded-full p-2 transition-all duration-300 ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a4 4 0 015.656-5.656l2.12 2.12a1 1 0 11-1.414 1.414L17.657 9.793a6 6 0 00-8.485-8.485l-2.12 2.12a1 1 0 011.414 1.414l2.12-2.12a4 4 0 015.656 5.656l2.12 2.12a1 1 0 11-1.414 1.414zM5 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button className={`hidden rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 md:inline-flex bg-gradient-to-r from-cyan-500 to-indigo-600 ${isDark ? 'hover:shadow-lg hover:shadow-cyan-500/20' : 'hover:shadow-lg hover:shadow-cyan-500/20'}`}>
              Get Started
            </button>
            <button className={`rounded-full border text-sm transition-all duration-300 px-4 py-2 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-slate-700' : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-cyan-400 hover:text-cyan-600 hover:bg-slate-100'}`}>
              Demo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-12">
        <section className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start xl:gap-20">
          <div className="pt-6">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium uppercase tracking-[0.25em] transition-all duration-300 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-blue-100 text-blue-700'}`}>
              AI Vocabulary for UPSC
            </span>

            <h1 className={`mt-8 max-w-3xl text-4xl font-semibold leading-tight transition-colors duration-300 sm:text-5xl lg:text-6xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Build editorial vocabulary
              <span className="block bg-gradient-to-r from-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                with intelligent precision.
              </span>
            </h1>

            <p className={`mt-6 max-w-2xl text-base leading-8 transition-colors duration-300 sm:text-lg ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Focus on curated UPSC words, meaningful context, and drill-ready practice in a simple, premium interface.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30">
                Start Free Trial
              </button>
              <button className={`inline-flex items-center justify-center rounded-full border text-sm transition-all duration-300 px-6 py-3 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-600 hover:bg-slate-50'}`}>
                Watch Demo
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-3xl border transition-all duration-300 p-6 ${isDark ? 'border-slate-700 bg-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : 'border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'}`}>
                <h3 className={`font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>AI Word Generator</h3>
                <p className={`mt-3 text-sm leading-7 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Curated editorial vocabulary for serious UPSC writing.
                </p>
              </div>

              <div className={`rounded-3xl border transition-all duration-300 p-6 ${isDark ? 'border-slate-700 bg-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : 'border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'}`}>
                <h3 className={`font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>Editorial Context</h3>
                <p className={`mt-3 text-sm leading-7 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Learn words in real sentences, not isolated definitions.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-full min-h-[700px] lg:min-h-[750px]">
            <div className={`absolute -inset-x-8 -top-12 h-64 rounded-[2.5rem] transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-cyan-500/8 via-indigo-500/0 to-indigo-500/8' : 'bg-gradient-to-r from-cyan-500/8 via-indigo-500/0 to-indigo-500/8'} blur-3xl`} />
            <div className={`relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border transition-all duration-300 p-8 ${isDark ? 'border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' : 'border-slate-200 bg-gradient-to-br from-white via-blue-50/30 to-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]'}`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold uppercase tracking-[0.3em] transition-all duration-300 bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent`}>AI Generator</p>
                <div className="flex gap-2">
                  <span className={`rounded-full border text-xs font-medium px-2.5 py-1 transition-all duration-300 ${isDark ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' : 'border-cyan-300 bg-cyan-50 text-cyan-700'}`}>Beta</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <input
                  type="text"
                  value={generatorInput}
                  onChange={(e) => setGeneratorInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerateWord()}
                  placeholder="Enter any UPSC vocabulary word..."
                  className={`rounded-2xl border px-5 py-3.5 text-base transition-all duration-300 focus:outline-none ${isDark ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40' : 'border-slate-300 bg-slate-50 text-slate-950 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40'}`}
                />
                <button
                  onClick={handleGenerateWord}
                  disabled={isLoading || !generatorInput.trim()}
                  className="group rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Analyzing word..." : "Generate Analysis"}
                </button>
              </div>

              {isLoading && (
                <div className="mt-8 flex flex-col items-center justify-center gap-3 py-8">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: "0ms" }} />
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: "150ms" }} />
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: "300ms" }} />
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Generating vocabulary insights...</p>
                </div>
              )}

              {!isLoading && (
                <div className={`mt-8 flex-1 space-y-5 overflow-y-auto transition-all duration-300`}>
                  {generatedWord ? (
                    <>
                      <div>
                        <h3 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>{generatorInput}</h3>
                        <p className={`mt-2.5 text-base transition-colors duration-300 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>{generatedWord.pronunciation}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${isDark ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' : 'border-cyan-300 bg-cyan-50 text-cyan-700'}`}>Ethics</span>
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${isDark ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' : 'border-indigo-300 bg-indigo-50 text-indigo-700'}`}>Editorial</span>
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${isDark ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-amber-300 bg-amber-50 text-amber-700'}`}>UPSC</span>
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${isDark ? 'border-slate-600 bg-slate-700 text-slate-300' : 'border-slate-300 bg-slate-100 text-slate-700'}`}>AI Powered</span>
                      </div>

                      <div className={`border-t pt-5 transition-all duration-300 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        <p className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Meaning</p>
                        <p className={`mt-3 text-base leading-7 transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>{generatedWord.meaning}</p>
                      </div>

                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Etymology</p>
                        <p className={`mt-3 text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{generatedWord.etymology}</p>
                      </div>

                      {generatedWord.editorial_example && (
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Editorial Example</p>
                          <p className={`mt-3 text-sm italic transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>"{generatedWord.editorial_example}"</p>
                        </div>
                      )}

                      {generatedWord.synonyms && (
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Synonyms</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(typeof generatedWord.synonyms === 'string' 
                              ? generatedWord.synonyms.split(',').map(s => s.trim())
                              : Array.isArray(generatedWord.synonyms) ? generatedWord.synonyms : []
                            ).map((syn, idx) => (
                              <span key={idx} className={`rounded-lg border px-3 py-1.5 text-sm transition-all duration-300 ${isDark ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:border-cyan-500/60 hover:bg-cyan-500/20' : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-100'}`}>
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {generatedWord.antonyms && (
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Antonyms</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(typeof generatedWord.antonyms === 'string' 
                              ? generatedWord.antonyms.split(',').map(a => a.trim())
                              : Array.isArray(generatedWord.antonyms) ? generatedWord.antonyms : []
                            ).map((ant, idx) => (
                              <span key={idx} className={`rounded-lg border px-3 py-1.5 text-sm transition-all duration-300 ${isDark ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/20' : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100'}`}>
                                {ant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                      <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${isDark ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-cyan-300 bg-cyan-50'}`}>
                        <svg className={`h-8 w-8 transition-colors duration-300 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Try an example</p>
                      <p className={`mt-2 text-sm transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Enter a word to see AI-powered analysis</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Daily words section (integrated component) */}
        <div className="mt-12">
          <div className={isDark ? 'dark' : ''}>
            <DailyWords isDark={isDark} />
          </div>
        </div>

        <section className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`rounded-[2rem] border transition-all duration-300 p-6 ${isDark ? 'border-slate-700 bg-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : 'border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'}`}>
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>Spaced Repetition</h3>
            <p className={`mt-3 text-sm leading-7 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Revisit terms exactly when they are ready to stick.
            </p>
          </div>

          <div className={`rounded-[2rem] border transition-all duration-300 p-6 ${isDark ? 'border-slate-700 bg-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : 'border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'}`}>
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>Smart Quizzes</h3>
            <p className={`mt-3 text-sm leading-7 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Practice with adaptive formats built for exam readiness.
            </p>
          </div>

          <div className={`rounded-[2rem] border transition-all duration-300 p-6 ${isDark ? 'border-slate-700 bg-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : 'border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'}`}>
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>Premium Vocabulary</h3>
            <p className={`mt-3 text-sm leading-7 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Focus on words that matter for essays, answers, and analysis.
            </p>
          </div>
        </section>

        

        <footer className={`mt-20 border-t transition-all duration-300 pt-8 text-sm ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={`font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-950'}`}>UPSC Vocab Builder</p>
              <p>Master editorial vocabulary with AI.</p>
            </div>

            <div className={`flex flex-wrap gap-4 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              <a className={`transition hover:${isDark ? 'text-white' : 'text-slate-950'}`}>Resources</a>
              <a className={`transition hover:${isDark ? 'text-white' : 'text-slate-950'}`}>Pricing</a>
              <a className={`transition hover:${isDark ? 'text-white' : 'text-slate-950'}`}>Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
    </>
  );
}

export default App;
