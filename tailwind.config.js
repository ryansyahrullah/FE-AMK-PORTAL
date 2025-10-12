/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          soft: '#60a5fa',
          dark: '#1d4ed8'
        },
        accent: {
          DEFAULT: '#f97316',
          soft: '#fdba74'
        },
        success: '#34d399',
        warning: '#facc15',
        info: '#38bdf8'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 20px 45px -25px rgba(37, 99, 235, 0.55)',
        card: '0 20px 60px -40px rgba(15, 23, 42, 0.45)'
      },
      backgroundImage: {
        'grid-dots':
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
        'glow-gradient': 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(56,189,248,0.8))'
      },
      spacing: {
        18: '4.5rem'
      }
    }
  },
  plugins: []
};
