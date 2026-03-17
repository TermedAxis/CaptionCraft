/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bat: {
          bg: '#0F0F0F',
          surface: '#1A1A1A',
          surface2: '#222222',
          border: '#2A2A2A',
          border2: '#333333',
          text: '#FFFFFF',
          muted: '#A0A0A0',
          subtle: '#6A6A6A',
          accent: '#E0E0E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'bat': '0 1px 3px rgba(0,0,0,0.5)',
        'bat-md': '0 4px 16px rgba(0,0,0,0.6)',
        'bat-lg': '0 8px 32px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
};
