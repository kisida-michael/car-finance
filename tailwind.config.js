/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: ["responsive", "motion-safe", "motion-reduce"],
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      backgroundColor: {
        admin: "#1f2335",
        card: "#2f334a",
        cardAlt: "#444963",
      },
      textColor: {
        "your-custom-color": "#123456",
        card: "#39394B",
      },
      borderColor: {
        admin: "#222131",
        card: "#39394B",
        cardAlt: "#4F4F66",
        "your-custom-color": "#123456",
      },
    },
    variants: {
      boxShadow: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    },
  },
  plugins: [require("flowbite/plugin")],
};
