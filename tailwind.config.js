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
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        'canvas-bg': 'var(--canvas-bg)',
        'node-bg': 'var(--node-bg)',
        'node-stroke': 'var(--node-stroke)',
        'connection-stroke': 'var(--connection-stroke)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'btn-primary-bg': 'var(--btn-primary-bg)',
        'btn-primary-text': 'var(--btn-primary-text)',
        'btn-secondary-bg': 'var(--btn-secondary-bg)',
        'btn-secondary-text': 'var(--btn-secondary-text)',
        'sidebar-bg': 'var(--sidebar-bg)',
        'toolbar-bg': 'var(--toolbar-bg)',
        'highlight': 'var(--highlight-color)',
      },
      height: {
        'screen-real': 'calc(var(--vh, 1vh) * 100)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
