/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004B87', // Deep blue
          light: '#E6F0FA',
        },
        secondary: {
          DEFAULT: '#00B4D8', // Aqua
        },
        accent: {
          DEFAULT: '#00A859', // Green CTA
          hover: '#008C4A',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
