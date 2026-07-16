/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        secondary: '#10B981',
        alert: '#F59E0B',
        critical: '#EF4444',
      },
      fontFamily: {
        geist: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
}
