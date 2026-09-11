import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import GlobalParticleTree from "@/components/GlobalParticleTree";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MemoirEngine — A Living Archive of Human Memory",
  description:
    "Capture, preserve and pass on the stories of the people you love. MemoirEngine uses voice AI to transform conversations into a living family archive.",
  keywords: ["family history", "memoir", "oral history", "AI biography", "memory preservation"],
  openGraph: {
    title: "MemoirEngine",
    description: "Some stories only exist in someone's voice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          :root {
            --font-display: var(--font-playfair), 'Georgia', 'Times New Roman', serif;
            --font-body: var(--font-inter), 'Helvetica Neue', 'Arial', sans-serif;
          }
        `}</style>
      </head>
      <body className="bg-primary text-primary font-body antialiased relative">
        <GlobalParticleTree />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
