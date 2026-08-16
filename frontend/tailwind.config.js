/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lime: '#F2FF58',
          'lime-hover': '#DAE039',
          green: '#74FF9E',
          'dark-green': '#083B2E',
          'deep-green': '#00C853',
          'secondary-green': '#006B4F',
          deep: '#061B17',
          black: '#000000',
          'dark-1': '#07130F',
          'dark-2': '#0A1A14',
          'deep-dark': '#001619',
          textPrimary: '#F5F7F5',
          textSecondary: '#A7B0AA',
          textMuted: '#6F7C75',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse': 'spin-reverse 20s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
