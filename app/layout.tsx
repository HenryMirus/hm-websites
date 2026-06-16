import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { PageTransition } from "@/components/ui/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "HM Websites — v2",
    template: "%s · HM Websites",
  },
  description:
    "HM Websites v2 — premium, animation-first websites built with Next.js, GSAP and Tailwind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
