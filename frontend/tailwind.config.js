/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        'darker-gray': '#0d0d0d', // Custom color between `gray-900` and pure black
      },
    },
  },
  plugins: [],
}
