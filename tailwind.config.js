/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F97316",        // orange accent
        background: "#F5F5F5",     // light gray page background
        surface: "#FFFFFF",        // white cards
        title: "#111827",          // near black headings
        body: "#374151",           // dark gray body text
        muted: "#9CA3AF",          // light gray secondary text
        border: "#E5E7EB",         // subtle borders
        success: "#10B981",        // green status
        warning: "#F59E0B",        // yellow status
        danger: "#EF4444",         // red status
      },
    },
  },
  plugins: [],
};