module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    // 👇 WAJIB untuk styling vue-sonner
    "./node_modules/vue-sonner/**/*.{js,mjs}",

    // Kalau pakai reka-ui juga
    "./node_modules/reka-ui/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
