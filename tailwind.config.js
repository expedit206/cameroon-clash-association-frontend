/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{vue,js,ts,jsx,tsx}", "./nuxt.config.{js,ts}"],
  theme: {
    extend: {
      colors: {
        dark: "#0a0b12",
        deep: "#06070a",
        gold: "#ffd700",
        primary: "#bb00ff",
        secondary: "#ffd700",
        card: "rgba(255, 255, 255, 0.05)",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
