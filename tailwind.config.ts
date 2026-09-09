import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0D0E",
          800: "#16191B",
          700: "#22262A",
          600: "#343A40",
          500: "#5B646C",
          400: "#8A939B",
          300: "#B6BEC5",
          200: "#DCE1E5",
          100: "#EDF0F2",
          50: "#F6F8F9",
        },
        signal: {
          DEFAULT: "#F5C518",
          600: "#D9A900",
          300: "#FFE37A",
          100: "#FFF6D1",
        },
        moss: { DEFAULT: "#0E7C5A", 100: "#E3F3ED" },
        clay: { DEFAULT: "#B4441F", 100: "#FBEAE3" },
        sky: { DEFAULT: "#1F5FCC", 100: "#E6EEFC" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.04em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,13,14,0.04), 0 1px 1px rgba(11,13,14,0.03)",
        pop: "0 12px 32px -8px rgba(11,13,14,0.18), 0 2px 8px rgba(11,13,14,0.08)",
        xray: "0 16px 40px -12px rgba(11,13,14,0.45)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "none" } },
        pulseRing: { "0%": { boxShadow: "0 0 0 0 rgba(245,197,24,0.55)" }, "70%": { boxShadow: "0 0 0 10px rgba(245,197,24,0)" }, "100%": { boxShadow: "0 0 0 0 rgba(245,197,24,0)" } },
      },
      animation: {
        fadeUp: "fadeUp .32s cubic-bezier(.2,.7,.3,1) both",
        pulseRing: "pulseRing 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
