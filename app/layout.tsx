import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "TheraPlan", description: "Adaptive physiotherapy planning and session logging" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
