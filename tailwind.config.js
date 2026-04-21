/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1f1f1f",
        secondary: "#e5e2e1",

      },
      fontFamily: {
        comfortaa: ['Comfortaa_400Regular', 'sans-serif'],
        comfortaaBold: ['Comfortaa_700Bold', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
