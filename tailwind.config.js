/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add your custom light/love theme colors here later
        lovePink: "#fdf2f8",
        loveRed: "#f43f5e",
      }
    },
  },
  plugins: [],
}