/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171A2E',
        paper: '#FAFAF7',
        coral: '#FF6B4A',
        teal: '#2DD4BF',
        muted: '#6B7280',
        line: '#E5E2DC',
      },
      boxShadow: {
        soft: '0 18px 55px rgba(23, 26, 46, 0.10)',
        glow: '0 18px 45px rgba(45, 212, 191, 0.22)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
