/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'admin': '#222131',
        'card': '#39394B',
      },
      textColor: {
        'your-custom-color': '#123456',
      },
      borderColor: {
        'your-custom-color': '#123456',
      },
    },
  },
  plugins: [],
}