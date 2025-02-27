import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      // Premium fonts
      fontFamily: {
        inter: ["var(--font-inter)"],
        poppins: ["var(--font-poppins)"],
        montserrat: ["var(--font-montserrat)"],
      },
  		colors: {
        // Custom color palette
        darkBg: "#020402", // CHANGE THIS VALUE TO UPDATE MAIN BACKGROUND COLOR
        lightCard: "#D69ADE", // White for cards against dark background
        textPrimary: "#FFFFFF", // White text for dark background
        textSecondary: "#FFFFFF", // Light teal for secondary text
        mint: "#FFFFFF", // Light teal/sage - retained
        sage: "#FFFFFF", // Dark brown - updated
        emerald: "#F7F7F7", // Dark gray - updated
        teal: "#FFFFFF", // Very dark, almost black - updated
        
        // Neutral shades
        neutral: {
          900: "#0B2027", // Dark teal - updated
          800: "#261C15", // Dark brown
          700: "#363636", // Dark gray
          600: "#414A42", // Medium-dark gray
          500: "#5C675D", // Medium gray
          400: "#768478", // Medium-light gray
          300: "#9AA99C", // Light gray
          200: "#BDC7BE", // Very light gray
          100: "#CCE3DE", // Light teal/sage
          50: "#F7F7F2",  // Light cream
        },
        
        // System colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': "#CCE3DE", // Light teal/sage - retained
          '2': "#261C15", // Dark brown - updated
          '3': "#363636", // Dark gray - updated
          '4': "#0B0A07", // Very dark, almost black - updated
          '5': "#FFFFFF"  // White
        }
      },
      // Animation utilities
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "slide-in": "slideIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
