/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Prettier plugin is optional but good for consistency
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        banana: {
          DEFAULT: "#FFE135", // Neon Banana Yellow
          50: "#FFFEF7",
          100: "#FFFDEB",
          200: "#FFFBCC",
          300: "#FFF7AD",
          400: "#FFF284",
          500: "#FFE135", // Primary
          600: "#DCC300",
          700: "#A69200",
          800: "#736500",
          900: "#403800",
          950: "#262100",
        },
        nano: {
          DEFAULT: "#0A0A0A", // Deep Black
          50: "#F5F5F5",
          100: "#EAEAEA",
          200: "#D5D5D5",
          300: "#BFBFBF",
          400: "#A0A0A0",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A", // Primary Background
        },
        // Accents for specific UI elements
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.5)",
        },
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
