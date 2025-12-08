import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Design System Colors
      colors: {
        primary: {
          DEFAULT: "#0A1B2A", // Deep Navy
          hover: "#0f2538",
        },
        accent: {
          DEFAULT: "#1A73E8", // Electric Blue
          hover: "#1557b8",
          soft: "#5CC8C1", // Soft Teal
        },
        bg: {
          DEFAULT: "#FFFFFF", // White
          muted: "#F3F5F7", // Light Gray
        },
        text: {
          main: "#101623", // Near-Black
          muted: "#6C7783", // Slate Gray
        },
        border: {
          DEFAULT: "#E0E5EC", // Neutral Border
        },
        danger: {
          DEFAULT: "#DC2626",
          hover: "#B91C1C",
        },
      },
      // Typography
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // Consistent typography scale
        xs: ["0.75rem", { lineHeight: "1.5" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.5" }], // 14px
        base: ["1rem", { lineHeight: "1.6" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.6" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.5" }], // 20px
        "2xl": ["1.5rem", { lineHeight: "1.4" }], // 24px
        "3xl": ["1.875rem", { lineHeight: "1.3" }], // 30px
        "4xl": ["2.25rem", { lineHeight: "1.2" }], // 36px
        "5xl": ["3rem", { lineHeight: "1.1" }], // 48px
      },
      // Spacing Scale (consistent 4px base)
      spacing: {
        // Standard scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
      },
      // Layout
      maxWidth: {
        container: "1200px",
        "page-sm": "640px",
        "page-md": "768px",
        "page-lg": "1024px",
        "page-xl": "1280px",
      },
      // Border Radius
      borderRadius: {
        sm: "0.375rem", // 6px
        DEFAULT: "0.5rem", // 8px
        md: "0.625rem", // 10px
        lg: "0.75rem", // 12px
        xl: "1rem", // 16px
        card: "0.75rem", // 12px
        button: "0.5rem", // 8px
      },
      // Shadows
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
}

export default config

