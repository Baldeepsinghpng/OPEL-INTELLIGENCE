import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        opel: {
          black: "#070809",
          carbon: "#0e1013",
          graphite: "#15181e",
          slate: "#1f242c",
          border: "#29313d",
          "border-bright": "#3b4555",
          lime: {
            DEFAULT: "#ccff00", // Signature electric lime
            muted: "#9ac400",
            glow: "rgba(204, 255, 0, 0.25)",
            subtle: "rgba(204, 255, 0, 0.08)",
          },
          silver: "#9ba1ad",
          light: "#f3f5f8",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        display: ["Outfit", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "lime-glow": "0 0 25px -4px rgba(204, 255, 0, 0.35)",
        "lime-glow-sm": "0 0 12px -2px rgba(204, 255, 0, 0.25)",
        "subtle-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar 6s linear infinite",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
