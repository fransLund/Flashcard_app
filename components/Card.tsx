
import React, { useState } from 'react';
import { Flashcard } from '../types';

interface CardProps {
  card: Flashcard;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full max-w-md h-80 perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">Original</span>
          <h2 className="text-3xl font-semibold text-slate-800 text-center">{card.term}</h2>
          <p className="mt-8 text-slate-300 text-sm italic">Click to reveal translation</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100">
          <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-4">Translation</span>
          <h2 className="text-2xl font-medium text-indigo-900 text-center mb-4">{card.definition}</h2>
          {card.context && (
            <p className="text-sm text-indigo-600 text-center italic bg-white/50 p-3 rounded-lg border border-indigo-100/50">
              "{card.context}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
