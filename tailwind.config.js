/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        'brand': {
          primary: '#4154f1',
          secondary: '#5969ff',
          accent: '#0ea5e9',
        },
      },
    },
  },
  plugins: [],
}

