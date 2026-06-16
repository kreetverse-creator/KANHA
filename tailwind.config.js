/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neural-dark': '#020817',
        'neural-darker': '#03111f',
        'neural-deepest': '#041b2d',
        'neural-cyan': '#38bdf8',
        'neural-teal': '#06b6d4',
        'neural-sea': '#14b8a6',
        'neural-accent': '#0ea5e9',
      },
      backdropBlur: {
        'xl': '40px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'glow-border': 'glow-border 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glow-border': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(56, 189, 248, 0.5)' },
          '50%': { 'box-shadow': '0 0 40px rgba(56, 189, 248, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
