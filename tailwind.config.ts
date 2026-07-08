import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ——— Leiterbahn v1.0 (docs/spec/hm-ci-leiterbahn.md §2/§8) ——— */
        substrat: {
          DEFAULT: "var(--substrat)",
          tief: "var(--substrat-tief)",
        },
        flaeche: "var(--flaeche)",
        lack: {
          DEFAULT: "var(--lack)",
          flaeche: "var(--lack-flaeche)",
        },
        ink: {
          DEFAULT: "var(--text)",
          dim: "var(--text-gedimmt)",
          invers: "var(--text-invers)",
          "invers-dim": "var(--text-invers-ged)",
        },
        kupfer: {
          DEFAULT: "var(--kupfer)",
          tief: "var(--kupfer-tief)",
          hell: "var(--kupfer-hell)",
        },
        linie: {
          DEFAULT: "var(--linie)",
          invers: "var(--linie-invers)",
        },
        status: {
          ok: "var(--ok)",
          warnung: "var(--warnung)",
          fehler: "var(--fehler)",
        },

        /* ——— Legacy (nur Portal/OS — Website nutzt ausschließlich Leiterbahn-Tokens;
               Portal-Umstieg auf Leiterbahn ist eigener Track, CI §7) ——— */
        bg: "#09090F",
        surface: "#111118",
        border: "#1E1E2E",
        primary: "#4F7FFF",
        "primary-dark": "#2A5CE8",
        accent: "#FF4D6A",
        "text-primary": "#EEEEFF",
        "text-muted": "#5A5A7A",
        "text-dim": "#8888AA",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-text)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        pad: "var(--radius)", // 2px — Pads sind eckig (CI §4)
      },
      transitionTimingFunction: {
        "leiter-out": "cubic-bezier(.22,1,.36,1)",
        "leiter-in": "cubic-bezier(.55,.06,.68,.19)",
      },
      maxWidth: {
        content: "72rem", // 1152px Content-Raster
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
