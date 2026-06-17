import type { Metadata } from "next";
// Per-project font: swap this import + the `font` call for the project typeface.
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { PageTransition } from "@/components/ui/PageTransition";
import { siteConfig, brandCssVars } from "@/lib/site.config";

const font = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Identity is driven entirely by lib/site.config.ts — no hard-coded strings.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={siteConfig.locale}
      className={font.variable}
      // Brand tokens come from siteConfig.brand — globals.css stays generic.
      style={brandCssVars() as React.CSSProperties}
    >
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
