/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lr-dark": "#202020",
        "lr-darker": "#181818",
        "lr-darkest": "#0f0f0f",
        "lr-light": "#f0f0f0",
        "lr-gray": "#777",
        "lr-blue": "#0088ff",
        "lr-orange": "#ff8800",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
