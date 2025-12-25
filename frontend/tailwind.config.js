/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          light: '#66BB6A',
          dark: '#388E3C',
          darker: '#2E7D32',
        },
        accent: {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#F57C00',
        },
        background: {
          DEFAULT: '#F5F5F5',
          dark: '#2E7D32',
          darker: '#1B5E20',
          overlay: 'rgba(46, 125, 50, 0.85)',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        serif: ['Alegreya SC', 'Georgia', 'serif'],
        display: ['Amarante', 'cursive'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
};
