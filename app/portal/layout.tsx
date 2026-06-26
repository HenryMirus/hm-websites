import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HM Labs — Portal",
  robots: "noindex, nofollow",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
