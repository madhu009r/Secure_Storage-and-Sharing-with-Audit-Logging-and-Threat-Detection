export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: "#0b0f1a",
          panel: "#12182b",
          border: "#1f2a44",
          safe: "#22c55e",
          warn: "#f59e0b",
          danger: "#ef4444",
          accent: "#3b82f6"
        }
      }
    }
  },
  plugins: []
}
