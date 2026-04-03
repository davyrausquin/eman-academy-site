import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eman Academy — Echte training voelt zo.",
  description:
    "Elite jeugdvoetbal in Den Haag. Maximaal 5 spelers per sessie. Onder leiding van international Sam Eman. Jaarrond training voor ambitieuze spelers van 7-14 jaar.",
  keywords: "voetbal, training, den haag, jeugd, academy, elite, sam eman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${bebas.variable}`}>
      <body>{children}</body>
    </html>
  );
}
