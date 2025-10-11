/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E88E5',
          dark: '#1565C0',
          light: '#90CAF9'
        }
      }
    }
  },
  plugins: []
};
