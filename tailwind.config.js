/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: ["responsive", "motion-safe", "motion-reduce"],

      backgroundColor: {
        admin: "#222131",
        card: "#39394B",
        cardAlt: "#4F4F66",
      },
      textColor: {
        "your-custom-color": "#123456",
        card: "#39394B",
      },
      borderColor: {
        "your-custom-color": "#123456",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
