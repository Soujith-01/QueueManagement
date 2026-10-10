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
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        canteen: {
          dark: '#0B0F19',
          card: '#131B2E',
          cardBorder: '#1E293B',
          accent: '#10B981',
          rush: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.2))' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
