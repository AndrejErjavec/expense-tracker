/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Helvetica Neue", "sans-serif"],
        serif: ["Newsreader", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
