import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Profyle — Your professional identity. Revealed.",
  description: "A 5-minute professional personality quiz. Find out how you work, who you work best with, and where you belong.",
  metadataBase: new URL("https://www.profyle.one"),
  openGraph: {
    title: "Profyle — Your professional identity. Revealed.",
    description: "A 5-minute professional personality quiz. Find out how you work, who you work best with, and where you belong.",
    url: "https://www.profyle.one",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
