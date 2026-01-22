
import React, { useState, useCallback } from 'react';
import { Flashcard, AppState } from './types';
import { translateGlosses } from './services/geminiService';
import Card from './components/Card';

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", 
  "Japanese", "Chinese (Mandarin)", "Korean", "Russian", "Arabic", 
  "Dutch", "Swedish", "Turkish", "Hindi", "Vietnamese"
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [inputGlosses, setInputGlosses] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGenerate = async () => {
    if (!inputGlosses.trim()) return;
    setAppState(AppState.LOADING);
    try {
      const cards = await translateGlosses(inputGlosses, targetLang);
      setFlashcards(cards);
      setAppState(AppState.STUDY);
      setCurrentIndex(0);
    } catch (error) {
      console.error(error);
      setAppState(AppState.INPUT);
      alert("Something went wrong generating cards. Please try again.");
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const shuffleDeck = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
  };

  const reset = () => {
    setAppState(AppState.INPUT);
    setFlashcards([]);
    setInputGlosses('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-2">Glossy Flash</h1>
        <p className="text-slate-500 font-light text-sm md:text-base">Minimalist flashcards powered by Gemini</p>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center">
        {appState === AppState.INPUT && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Paste Glosses</label>
              <textarea
                value={inputGlosses}
                onChange={(e) => setInputGlosses(e.target.value)}
                placeholder="e.g. Chat, Chien, Maison... (One per line or comma separated)"
                className="w-full h-48 p-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none bg-white text-slate-700 shadow-sm"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Target Language</label>
              <div className="relative">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-700 shadow-sm appearance-none cursor-pointer"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!inputGlosses.trim()}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-semibold shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
            >
              Generate Deck
            </button>
          </div>
        )}

        {appState === AppState.LOADING && (
          <div className="flex flex-col items-center space-y-6 py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-500 font-light animate-pulse tracking-wide">Crafting your study session...</p>
          </div>
        )}

        {appState === AppState.STUDY && flashcards.length > 0 && (
          <div className="w-full flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center w-full max-w-md px-2">
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Card {currentIndex + 1} / {flashcards.length}</span>
                 <button 
                  onClick={shuffleDeck}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Shuffle Deck"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,165.66a8,8,0,0,1-11.32,0L200,147.31V160a40,40,0,0,1-40,40H112a8,8,0,0,1,0-16h48a24,24,0,0,0,24-24V147.31l-18.34,18.35a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l32,32A8,8,0,0,1,229.66,165.66Zm-136-75.32L75.31,108.69a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32L109.31,90.69V112a24,24,0,0,0,24,24h48a8,8,0,0,1,0,16H133.34A40,40,0,0,1,93.34,112V90.34l-18.34,18.35a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l32,32A8,8,0,0,1,93.66,90.34ZM112,64a8,8,0,0,1,0,16H64A24,24,0,0,0,40,104v48a24,24,0,0,0,24,24H72a8,8,0,0,1,0,16H64a40,40,0,0,1-40-40V104A40,40,0,0,1,64,64ZM232,104v48a40,40,0,0,1-40,40h-8a8,8,0,0,1,0-16h8a24,24,0,0,0,24-24V104a24,24,0,0,0-24-24h-8a8,8,0,0,1,0-16h8A40,40,0,0,1,232,104Z"></path></svg>
                </button>
              </div>
              <button 
                onClick={reset}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                New Deck
              </button>
            </div>

            {/* Passing key ensures the card resets its flip state on change */}
            <Card key={flashcards[currentIndex].id} card={flashcards[currentIndex]} />

            <div className="flex space-x-4 w-full max-w-md">
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="flex-1 py-4 bg-white text-slate-700 rounded-2xl border border-slate-200 font-medium hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
              >
                Previous
              </button>
              <button
                onClick={nextCard}
                disabled={currentIndex === flashcards.length - 1}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-medium shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Next
              </button>
            </div>
            
            <div className="w-full max-w-md h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {appState === AppState.STUDY && flashcards.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-6 font-light italic">No cards were generated. Try adding more specific glosses.</p>
            <button onClick={reset} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md">Try Again</button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-8">
        <div className="flex items-center space-x-3 text-slate-300">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Built with Gemini</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
