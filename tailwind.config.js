module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0d",
        panel: "#0f1113",
        accent: "#7c5cff",
        subtle: "#9aa4b2",
      },
      boxShadow: {
        glow: "0 10px 30px rgba(124,92,255,0.12)",
      },
    },
  },
  plugins: [],
};
