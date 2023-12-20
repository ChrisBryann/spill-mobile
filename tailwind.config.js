/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nav-gray': '#D9D9D9',
        'search-bar-gray': '#7B7B7B',
        'expense-gray': '#484848',
        'error-red': '#FF8E87',
      },
    },
  },
  plugins: [],
};
