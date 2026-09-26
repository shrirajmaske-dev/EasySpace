import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glow = null, // 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber'
  elevated = false,
  onClick,
  ...props
}) => {
  const glowClasses = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-glow-cyan bg-cyan-50/50 dark:bg-cyan-950/15',
    violet: 'border-purple-500/30 hover:border-purple-400/60 shadow-glow-violet bg-purple-50/50 dark:bg-purple-950/15',
    rose: 'border-rose-500/30 hover:border-rose-400/60 shadow-glow-rose bg-rose-50/50 dark:bg-rose-950/15',
    emerald: 'border-emerald-500/30 hover:border-emerald-400/60 shadow-glow-emerald bg-emerald-50/50 dark:bg-emerald-950/15',
    amber: 'border-amber-500/30 hover:border-amber-400/60 shadow-glow-amber bg-amber-50/50 dark:bg-amber-950/15',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 relative ${
        elevated ? 'shadow-card-elevated' : ''
      } ${
        hover ? 'glass-panel-hover cursor-pointer group' : ''
      } ${glow ? glowClasses[glow] : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
