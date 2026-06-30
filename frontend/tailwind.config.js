/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",      // Blue
        secondary: "#10B981",    // Green
        danger: "#EF4444",       // Red
        warning: "#F59E0B",      // Amber
        dark: "#111827",         // Gray-900
        light: "#F9FAFB",        // Gray-50
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
      },

      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};