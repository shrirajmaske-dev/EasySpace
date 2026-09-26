import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#060913] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 via-brand-500 to-blue-600 hover:from-cyan-400 hover:via-brand-400 hover:to-blue-500 text-slate-950 shadow-glow-cyan shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)] focus:ring-cyan-400 hover:shadow-cyan-500/30 font-bold',
    secondary: 'bg-white dark:bg-surface-800/90 hover:bg-slate-100 dark:hover:bg-surface-700/90 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] focus:ring-slate-400',
    outline: 'border border-cyan-600/40 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:border-cyan-500 shadow-sm focus:ring-cyan-500',
    accent: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-glow-violet shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] focus:ring-purple-400',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-glow-rose shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] focus:ring-rose-400',
    dangerGhost: 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 focus:ring-rose-400',
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-800/60 focus:ring-slate-500',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow-emerald shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] focus:ring-emerald-400'
  };

  const sizes = {
    xs: 'text-[11px] px-2.5 py-1 gap-1 rounded-lg',
    sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-xl',
    md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3 gap-2.5 rounded-2xl font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />}
          <span>{children}</span>
          {IconRight && <IconRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
        </>
      )}
    </button>
  );
};
