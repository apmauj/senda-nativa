import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SENDA NATIVA · EL RECORRIDO DE LOS ANIMALES DEL URUGUAY",
  description:
    "Juego de tablero educativo con animales autóctonos de Uruguay: sumas y restas por casillas, dado y recompensas. Para chicas y chicos de 4 a 8 años.",
  keywords: [
    "juego educativo",
    "matemática",
    "animales de uruguay",
    "carpincho",
    "yaguareté",
    "sumas y restas",
  ],
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
