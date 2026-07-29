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
        kyy: {
          bg: '#070913',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(147, 51, 234, 0.25)',
          glow: '#9333ea',
          cyan: '#06b6d4',
          pink: '#ec4899',
          violet: '#7c3aed',
          emerald: '#10b981',
          accent: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'rocket-fly': 'rocket-fly 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.9))' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        'rocket-fly': {
          '0%': { transform: 'translate(-50%, 100vh) scale(0.5)', opacity: '0' },
          '30%': { opacity: '1', transform: 'translate(-50%, 50vh) scale(1.2)' },
          '100%': { transform: 'translate(-50%, -150vh) scale(1.5)', opacity: '1' }
        }
      },
      boxShadow: {
        'neon-purple': '0 0 25px -5px rgba(147, 51, 234, 0.5), 0 0 10px -5px rgba(147, 51, 234, 0.3)',
        'neon-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5), 0 0 10px -5px rgba(6, 182, 212, 0.3)',
        'neon-pink': '0 0 25px -5px rgba(236, 72, 153, 0.5), 0 0 10px -5px rgba(236, 72, 153, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
};
