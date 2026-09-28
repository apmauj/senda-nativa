import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = "https://apmauj.github.io/senda-nativa/";
const shareTitle = "Senda Nativa | Juego de sumas y restas";
const shareDescription =
  "Tirá el dado, resolvé sumas y restas y recorré Uruguay junto a sus animales autóctonos. Un juego para chicas y chicos de 4 a 8 años.";
const shareImageAlt =
  "Senda Nativa, juego educativo de sumas y restas con animales del Uruguay";

export const metadata: Metadata = {
  metadataBase: new URL("https://apmauj.github.io/senda-nativa/"),
  title: shareTitle,
  description: shareDescription,
  applicationName: "Senda Nativa",
  keywords: [
    "juego educativo",
    "matemática",
    "animales de uruguay",
    "carpincho",
    "yaguareté",
    "sumas y restas",
  ],
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: siteUrl,
    siteName: "Senda Nativa",
    title: shareTitle,
    description: shareDescription,
    images: [
      {
        url: `${siteUrl}senda-nativa-og.png`,
        width: 1200,
        height: 630,
        alt: shareImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [`${siteUrl}senda-nativa-twitter.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${baloo.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
