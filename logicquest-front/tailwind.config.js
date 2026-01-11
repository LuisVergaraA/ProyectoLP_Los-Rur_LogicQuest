/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'logic-dark': '#1e293b',
        'logic-blue': '#3b82f6',
      }
    },
  },
  plugins: [],
}