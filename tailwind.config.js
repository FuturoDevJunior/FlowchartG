/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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
    },
  },
  plugins: [],
};
