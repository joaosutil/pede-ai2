/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      // Aqui adicionamos as animações que o App.jsx usa para não "piscar"
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'bounce-short': 'bounce 1s infinite 2s',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-from-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-from-bottom': 'slideInBottom 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}