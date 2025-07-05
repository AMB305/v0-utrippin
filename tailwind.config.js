export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-pulse': 'gradientPulse 8s ease infinite',
        'pulse-gradient': 'pulse-gradient 3s ease-in-out infinite',
      },
      keyframes: {
        gradientPulse: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.15)' },
        },
      },
    },
  },
  plugins: [],
}