import type { Config } from "tailwindcss";

/**
 * Design System (SaaS Premium) — Astron (Painel RH)
 *
 * Observação:
 * - Este arquivo apenas **estende** o Tailwind (não altera estilos existentes do site público).
 * - As telas do painel RH passam a reutilizar tokens/cores via classes Tailwind.
 */
export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#354a80",
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        secondary: {
          DEFAULT: "#a2122a",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1f2937",
          900: "#0f172a",
        },
        success: "#16a34a",
        warning: "#facc15",
        error: "#dc2626",
      },
      borderRadius: {
        md: "10px",
        lg: "16px",
        full: "999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
        md: "0 8px 24px rgba(15, 23, 42, 0.08)",
        lg: "0 16px 48px rgba(15, 23, 42, 0.10)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      transitionDuration: {
        180: "180ms",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0, 0, 0.2, 1)",
      },
      backgroundImage: {
        "premium-gradient": "linear-gradient(90deg, #354a80, #1e2b50)",
      },
    },
  },
  plugins: [],
} satisfies Config;


