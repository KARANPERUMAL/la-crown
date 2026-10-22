/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lacrown: {
          bg: '#FFF8F6',
          green: '#00552F',
          'green-dark': '#003E22',
          pink: '#E63886',
          'pink-soft': '#F49AB9',
          'pink-light': '#FDF0F4',
          'pink-pill': '#FCE7EE',
          muted: '#8F7A82',
        },
      },
      fontFamily: {
        condensed: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tightest: '-0.07em',
      },
    },
  },
  plugins: [],
};
