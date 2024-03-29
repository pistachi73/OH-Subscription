import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "475px",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(90deg, #fff, rgba(255, 255, 255, .991) 6.67%, rgba(255, 255, 255, .964) 13.33%, rgba(255, 255, 255, .918) 20%, rgba(255, 255, 255, .853) 26.67%, rgba(255, 255, 255, .768) 33.33%, rgba(255, 255, 255, .668) 40%, rgba(255, 255, 255, .557) 46.67%, rgba(255, 255, 255, .443) 53.33%, rgba(255, 255, 255, .332) 60%, rgba(255, 255, 255, .232) 66.67%, rgba(255, 255, 255, .147) 73.33%, rgba(255, 255, 255, .082) 80%, rgba(255, 255, 255, 0) 86.67%);",
      },
      height: {
        header: "var(--header-height)",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
      },

      fontSize: {
        "3xs": ["8px", "12px"],
        "2xs": ["10px", "14px"],
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          50: "#f5f6f8",
          100: "#e2e3eb",
          200: "#babdd0",
          300: "#898eae",
          400: "#626993",
          500: "#3b4378",
          600: "#2f3660",
          700: "#232848",
          800: "#181b30",
          900: "#0c0d18",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "form-message-div-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0px",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "25px",
          },
        },
        "form-message-p-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0rem",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "25px",
          },
        },
        "password-input-div-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0px",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "100px",
          },
        },
        "password-input-p-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0px",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "100px",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "form-message-div-down":
          "form-message-div-down 250ms ease-out 0s 1 normal none running",
        "form-message-p-down":
          "form-message-p-down 200ms ease 200ms 1 normal none running",
        "password-input-div-down":
          "password-input-div-down 250ms ease-out 0s 1 normal none running",
        "password-input-p-down":
          "password-input-p-down 200ms ease 200ms 1 normal none running",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
