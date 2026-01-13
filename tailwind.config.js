/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'system-dark': '#0a0e27',
        'system-darker': '#060919',
        'neon-blue': '#00d4ff',
        'neon-cyan': '#00ffff',
        'gold': '#ffd700',
        'rank-e': '#8b8b8b',
        'rank-d': '#4169e1',
        'rank-c': '#9370db',
        'rank-b': '#ff69b4',
        'rank-a': '#ffd700',
        'rank-s': '#ff0000',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
        'neon-sm': '0 0 5px #00d4ff, 0 0 10px #00d4ff',
      },
    },
  },
  plugins: [],
}
