import type { Config } from "tailwindcss";

// Kinetic Terminal design system — tokens lifted directly from the
// approved DESIGN.md so the build matches the mockups exactly.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#3a3939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#171717",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c2c6d6",
        "on-background": "#e5e2e1",
        outline: "#8c909f",
        "outline-variant": "#262626",
        primary: "#adc6ff",
        "on-primary": "#002e6a",
        "primary-container": "#4d8eff",
        "on-primary-container": "#00285d",
        secondary: "#4edea3",
        "on-secondary": "#003824",
        "secondary-container": "#00a572",
        "on-secondary-container": "#00311f",
        tertiary: "#ffb786",
        "on-tertiary": "#502400",
        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "surface-tint": "#adc6ff",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
      },
      fontSize: {
        "mono-label": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
        "headline-md": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "500" }],
        "headline-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "600" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-base": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "mono-code": ["13px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      spacing: {
        unit: "4px",
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
      },
      maxWidth: {
        "max-width": "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
