/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Questrial", "sans-serif"],
      },
        keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
         animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
      },
      },
    },
  },
  plugins: [],
};