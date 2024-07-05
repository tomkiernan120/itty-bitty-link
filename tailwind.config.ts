import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    fontSize: {
      xs: ["0.694rem", { lineHeight: "1rem" }],
      sm: ["0.833rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.1200rem", { lineHeight: "1.75rem" }],
      xl: ["1.440rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.728rem", { lineHeight: "2rem" }],
      "3xl": ["2.488rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.986rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }]
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-rubik)", "sans-serif"]
      },
      colors: {
        darkgreen: {
          50: "#f0f9f8",
          100: "#d9f2eb",
          200: "#a9e0d2",
          300: "#78cdb9",
          400: "#47bb9f",
          500: "#115753",
          600: "#3a8e7a",
          700: "#2e6e5f",
          800: "#225e4a",
          900: "#184d3c"
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#0D7F83",
          600: "#0d9488",
          700: "#0e7f72",
          800: "#0e6b5f",
          900: "#0c5656"
        },
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#86C57D",
          600: "#7ca059",
          700: "#6c8749",
          800: "#5a7235",
          900: "#4a5d2f"
        },
        mustard: {
          50: "#fffbea",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#86C57D",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#642e09"
        },
        burntorange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: '#E14F3C',
          600: "#d97704",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f"
        }
      }
    }
  },
  plugins: []
};
export default config;
