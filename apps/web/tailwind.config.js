/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF3366',
          hover: '#FF6B6B',
        },
        amber: {
          500: '#f59e0b',
          600: '#d97706',
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
