import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export const QuizTimer = ({ initialSeconds = 600, onTimeExpired }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeExpired) onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60;

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-inner ${
        isUrgent
          ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-pulse shadow-glow-rose/20'
          : 'bg-surface-950/90 border-white/[0.1] text-cyan-300'
      }`}
    >
      {isUrgent ? (
        <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
      )}
      <span>
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
};
