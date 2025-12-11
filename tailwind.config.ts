import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Modern SaaS Design System Colors - Inspired by Pipely
      colors: {
        // Backgrounds - Warm, neutral tones
        bg: {
          DEFAULT: "#FAFAF9", // Warm off-white
          muted: "#F5F5F4", // Slightly darker for sections
          card: "#FFFFFF", // Pure white for cards
        },
        // Primary Accent - Soft but confident blue
        accent: {
          DEFAULT: "#3B82F6", // Modern blue
          hover: "#2563EB", // Darker for hover
          light: "#DBEAFE", // Light blue for backgrounds
          soft: "#60A5FA", // Softer blue variant
        },
        // Secondary Accent - Warm tone
        secondary: {
          DEFAULT: "#F59E0B", // Warm amber/orange
          hover: "#D97706", // Darker for hover
          light: "#FEF3C7", // Light amber for backgrounds
        },
        // Text Colors
        text: {
          main: "#1F2937", // Near-black, warm gray
          muted: "#6B7280", // Medium gray
          light: "#9CA3AF", // Light gray for hints
          inverse: "#FFFFFF", // White text
        },
        // Borders
        border: {
          DEFAULT: "#E5E7EB", // Soft gray
          light: "#F3F4F6", // Very light
          accent: "#3B82F6", // Accent color
        },
        // Status Colors
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        // Legacy compatibility
        primary: {
          DEFAULT: "#1F2937",
          hover: "#111827",
        },
      },
      // Typography - Modern SaaS with Inter
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
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
      // Border Radius - Soft, rounded corners
      borderRadius: {
        sm: "0.5rem", // 8px
        DEFAULT: "0.75rem", // 12px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
        card: "1rem", // 16px
        button: "0.75rem", // 12px
        full: "9999px",
      },
      // Shadows - Soft, subtle shadows
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
}

export default config

