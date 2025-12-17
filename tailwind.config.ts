import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      keyframes: {
        pulseShadow: {
          "0%, 100%": { boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" },
          "50%": { boxShadow: "0 4px 25px rgba(0, 0, 0, 0.4)" },
        },
      },
      animation: {
        pulseShadow: "pulseShadow 0.1s ease-in-out 5",
      },
    },
  },
  plugins: [],
} satisfies Config;
