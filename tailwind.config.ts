import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/theme/plugin");

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    // Also handle nested node_modules paths for HeroUI
    "./node_modules/@heroui/react/node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-onest)", "sans-serif"],
        headline: ["var(--font-oswald)", "sans-serif"],
        code: ["monospace", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "count-up": {
          "0%": { "--num": "0" } as any,
          "100%": { "--num": "100" } as any,
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [
    heroui({
      addCommonColors: true,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#11181C",
            primary: {
              50: "#EEF2FF",
              100: "#E0E7FF",
              200: "#C7D2FE",
              300: "#A5B4FC",
              400: "#818CF8",
              500: "#6366F1",
              600: "#4F46E5",
              700: "#4338CA",
              800: "#3730A3",
              900: "#312E81",
              DEFAULT: "#4F46E5",
              foreground: "#FFFFFF",
            },
            secondary: {
              50: "#F5F3FF",
              100: "#EDE9FE",
              200: "#DDD6FE",
              300: "#C4B5FD",
              400: "#A78BFA",
              500: "#8B5CF6",
              600: "#7C3AED",
              700: "#6D28D9",
              800: "#5B21B6",
              900: "#4C1D95",
              DEFAULT: "#7C3AED",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#10B981",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#F59E0B",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            background: "#0A0A0F",
            foreground: "#ECEDEE",
            primary: {
              50: "#1E1B4B",
              100: "#2E2A6E",
              200: "#3730A3",
              300: "#4338CA",
              400: "#4F46E5",
              500: "#6366F1",
              600: "#818CF8",
              700: "#A5B4FC",
              800: "#C7D2FE",
              900: "#E0E7FF",
              DEFAULT: "#6366F1",
              foreground: "#FFFFFF",
            },
            secondary: {
              50: "#2E1065",
              100: "#3B0764",
              200: "#5B21B6",
              300: "#6D28D9",
              400: "#7C3AED",
              500: "#8B5CF6",
              600: "#A78BFA",
              700: "#C4B5FD",
              800: "#DDD6FE",
              900: "#EDE9FE",
              DEFAULT: "#8B5CF6",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#34D399",
              foreground: "#000000",
            },
            warning: {
              DEFAULT: "#FBBF24",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#F87171",
              foreground: "#000000",
            },
            content1: "#18181B",
            content2: "#27272A",
            content3: "#3F3F46",
            content4: "#52525B",
          },
        },
      },
    }),
    function ({
      addUtilities,
    }: {
      addUtilities: (
        utilities: Record<string, Record<string, string>>
      ) => void;
    }) {
      addUtilities({
        ".pause-animation": {
          "animation-play-state": "paused",
        },
        ".text-gradient": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".glass": {
          "background": "rgba(255, 255, 255, 0.05)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
          "border": "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".glass-light": {
          "background": "rgba(255, 255, 255, 0.7)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
          "border": "1px solid rgba(255, 255, 255, 0.3)",
        },
      });
    },
  ],
} satisfies Config;
