import type { Config } from "tailwindcss";

// Palette mirrors mzalendo.com's core.css tokens (primary hsl 358 81% 41%,
// secondary hsl 144 100% 25%, Montserrat, 4px radius).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mz: {
          red: "#bd1419",
          "red-dark": "#700f12",
          maroon: "#8d1820",
          green: "#008033",
          "green-dark": "#00661a",
          text: "#333333",
          muted: "#6b6b6b",
          border: "#e3e3e3",
          subtle: "#f8f8f8",
        },
        band: {
          clear: "#008033",
          low: "#9a6b00",
          elevated: "#c2410c",
          high: "#7a1620",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      borderRadius: { mz: "4px" },
    },
  },
  plugins: [],
};

export default config;
