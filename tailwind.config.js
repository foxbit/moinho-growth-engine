/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        secondary: '#065FD4',
        alert: '#FB8C00',
        critical: '#EF4444',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
}
