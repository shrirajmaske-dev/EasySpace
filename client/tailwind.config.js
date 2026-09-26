/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: {
          50: 'var(--color-surface-50)',
          100: 'var(--color-surface-100)',
          700: 'var(--color-surface-700)',
          800: 'var(--color-surface-800)',
          850: 'var(--color-surface-850)',
          900: 'var(--color-surface-900)',
          950: 'var(--color-surface-950)',
        },
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#082f49',
        },
        accent: {
          violet: '#8b5cf6',
          indigo: '#6366f1',
          purple: '#a855f7',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#00f2fe',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.35)',
        'glow-violet': '0 0 30px -5px rgba(139, 92, 246, 0.35)',
        'glow-rose': '0 0 30px -5px rgba(244, 63, 94, 0.35)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 30px -5px rgba(245, 158, 11, 0.35)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'card-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
