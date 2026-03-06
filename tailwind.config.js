/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#B8860B',
          light: '#D4A843',
          dark: '#8B6914',
          50: '#FBF7ED',
          100: '#F5ECD3',
          200: '#E8D5A0',
          500: '#B8860B',
          700: '#8B6914',
          900: '#5C4510',
        },
        ivory: {
          DEFAULT: '#FAF7F0',
          warm: '#F5F0E6',
          dark: '#EDE7D9',
        },
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#2C3E6B',
          dark: '#0F1B33',
        },
        parchment: '#F8F4EB',
        espresso: '#3C2415',
        slate: '#5A6577',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        widthGrow: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        fadeUp: 'fadeUp 0.8s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        modalIn: 'modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 3s ease-in-out infinite',
        widthGrow: 'widthGrow 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
