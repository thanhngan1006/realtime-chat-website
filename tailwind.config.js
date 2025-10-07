export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        customGray: '#f0f0f0',
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        accent: '#22d3ee',
        surface: '#0f172a',
      },
      boxShadow: {
        glow: '0 28px 60px -25px rgba(6, 182, 212, 0.45)',
      },
      backgroundImage: {
        'grid-light':
          'radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.12) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
