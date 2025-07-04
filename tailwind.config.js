/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Tailwind blue-600
        accent: '#FF6200',
        darkblue: '#002974',
      },
    },
  },
  plugins: [],
}