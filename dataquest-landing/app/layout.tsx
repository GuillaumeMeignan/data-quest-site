import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Nunito_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable", // keeps the optical-size axis used by the mock-up (opsz 12..96)
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-nunito",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = "Data Quest — le jeu de cartes quotidien sur vos vraies données";
const description =
  "Data Quest est un jeu de cartes quotidien construit sur les vraies données de votre entreprise : 5 cartes par jour pour que vos équipes ouvrent enfin leurs dashboards. Demandez une démo.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Data Quest",
    title,
    description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#14302B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
