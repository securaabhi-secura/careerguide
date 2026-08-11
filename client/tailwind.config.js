/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6C4CF1",
          light: "#8B5CF6",
          soft: "#EDE9FE",
          dark: "#1E293B",
        },
        muted: "#64748B",
        surface: "#F8F9FC",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(108, 76, 241, 0.08)",
      },
    },
  },
  plugins: [],
};
