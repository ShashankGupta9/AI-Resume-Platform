import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          orange: "#FF6803",
          terracotta: "#AE3A02",
          silver: "#BFBFBF",
          obsidian: "#0B0501",
          card: "rgba(18, 12, 10, 0.75)",
          border: "rgba(255, 104, 3, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-neue-montreal)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'glow-orange': '0 0 40px -10px rgba(255, 104, 3, 0.35)',
        'glow-subtle': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
