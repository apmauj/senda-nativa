import type { NextConfig } from "next";

// Configuración para desarrollo local del juego completo (con base de datos).
// La versión web estática se genera con `bun run generar:web`, que usa
// temporalmente output: "export" (ver generar-version-web.sh).
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
