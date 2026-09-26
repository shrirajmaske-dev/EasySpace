import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme.js';

export const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5 rounded-lg text-xs',
    md: 'p-2 rounded-xl text-sm',
    lg: 'p-2.5 rounded-xl text-base'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center transition-all duration-300 border cursor-pointer select-none group ${
        isDark
          ? 'bg-surface-900/80 hover:bg-surface-800 text-amber-400 border-white/[0.1] hover:border-amber-400/40 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-indigo-600 border-slate-200 hover:border-indigo-400/50 shadow-sm'
      } ${sizeClasses[size]} ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className={`${iconSizes[size]} transition-transform duration-300 rotate-0 group-hover:rotate-45 text-amber-400`} />
        ) : (
          <Moon className={`${iconSizes[size]} transition-transform duration-300 -rotate-12 group-hover:rotate-0 text-indigo-600 fill-indigo-600/20`} />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
