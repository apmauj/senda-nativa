#!/usr/bin/env bash
# ============================================================
# SENDA NATIVA — Generador de la versión web estática
# ------------------------------------------------------------
# Compila el juego como sitio estático (output: "export") y lo
# deja en ../juego-web-nueva/, listo para abrir con doble clic
# (index.html) o para hostear en cualquier hosting estático. Con el
# argumento "pages", deja el export en ./out para GitHub Pages.
#
# Requiere Bun (preferido) o Node.js 20+ con npx.
# Uso:  bun run generar:web      (o:  bash generar-version-web.sh)
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

TARGET="${1:-standalone}"
if [ "$TARGET" != "standalone" ] && [ "$TARGET" != "pages" ]; then
  echo "Uso: bash generar-version-web.sh [standalone|pages]" >&2
  exit 2
fi
if [ "$TARGET" = "standalone" ]; then
  unset PAGES_BASE_PATH
else
  export PAGES_BASE_PATH="${PAGES_BASE_PATH:-/senda-nativa}"
fi

# --- elegir runner -------------------------------------------------
if command -v bun >/dev/null 2>&1; then
  RUNNER="bunx"; NODE_BIN="bun"
else
  RUNNER="npx"; NODE_BIN="node"
fi

API_BACKUP=".api-backup-tmp"
CONFIG_BACKUP="next.config.ts.bak"

# --- restaurar todo aunque algo falle ------------------------------
cleanup() {
  rm -rf src/app/api
  [ -d "$API_BACKUP" ] && mv "$API_BACKUP" src/app/api
  [ -f "$CONFIG_BACKUP" ] && mv "$CONFIG_BACKUP" next.config.ts
}
trap cleanup EXIT

# --- 1) configuración de export ------------------------------------
cp next.config.ts "$CONFIG_BACKUP"
cat > next.config.ts <<'EOF'
import type { NextConfig } from "next";

// Configuración temporal para el build estático (generada por
// generar-version-web.sh; la configuración normal se restaura sola).
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES_BASE_PATH || "",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

export default nextConfig;
EOF

# --- 2) las rutas de API no existen en la versión estática ---------
rm -rf "$API_BACKUP"
[ -d src/app/api ] && mv src/app/api "$API_BACKUP"

# --- 3) build -------------------------------------------------------
echo "▶ Compilando la versión estática (next build)…"
"$RUNNER" next build

OUT="out"

if [ "$TARGET" = "pages" ]; then
  # GitHub Pages no infiere image/png para las rutas de metadata sin
  # extensión que genera Next.js. Copiarlas con .png evita previews con
  # tipo application/octet-stream en los servicios que comparten el link.
  echo "▶ Preparando imágenes Open Graph y Twitter…"
  SHARE_IMAGE_VERSION="${GITHUB_SHA:-local}"
  SHARE_IMAGE_VERSION="${SHARE_IMAGE_VERSION:0:12}"
  OG_IMAGE_NAME="senda-nativa-og-${SHARE_IMAGE_VERSION}.png"
  TWITTER_IMAGE_NAME="senda-nativa-twitter-${SHARE_IMAGE_VERSION}.png"
  export OG_IMAGE_NAME TWITTER_IMAGE_NAME
  cp "$OUT/opengraph-image" "$OUT/$OG_IMAGE_NAME"
  cp "$OUT/twitter-image" "$OUT/$TWITTER_IMAGE_NAME"
  perl -0pi -e '
    my $head_end = index($_, "</head>");
    die "No se encontró </head> en el HTML exportado" if $head_end < 0;
    my $head = substr($_, 0, $head_end);
    my $base = $ENV{PAGES_BASE_PATH} // "";
    $base =~ s{/$}{};
    my $og = $head =~ s{\Q$base\E/opengraph-image\?[^\"]+}{$base/$ENV{OG_IMAGE_NAME}}g;
    my $twitter = $head =~ s{\Q$base\E/twitter-image\?[^\"]+}{$base/$ENV{TWITTER_IMAGE_NAME}}g;
    die "No se encontraron las etiquetas de preview en el HTML exportado" unless $og && $twitter;
    substr($_, 0, $head_end) = $head;
  ' "$OUT/index.html"
fi

if [ "$TARGET" = "standalone" ]; then
  # --- 4a) rutas relativas en los HTML (doble clic sin servidor) ---
  echo "▶ Convirtiendo rutas a relativas…"
  for f in "$OUT"/index.html "$OUT"/404.html "$OUT"/_not-found.html; do
    [ -f "$f" ] && perl -pi -e 's{(src|href)="/_next/}{$1="./_next/}g' "$f"
  done

  # --- 4b) parche del runtime de turbopack ---------------------------
  # El runtime deriva la clave de cada chunk de getAttribute("src")
  # literal; con src relativos ("./_next/…") no coincide con las refs
  # absolutas del payload. El parche normaliza "./" → "/" antes del
  # matching, lo que hace funcionar la hidratación con file://.
  echo "▶ Parcheando el runtime de turbopack…"
  RT=$(ls "$OUT"/_next/static/chunks/turbopack-*.js 2>/dev/null | head -1)
  if [ -n "$RT" ]; then
    "$NODE_BIN" tools/patch-runtime.js "$RT" || {
      echo "⚠ No se pudo parchear el runtime (¿cambió la versión de Next?)."
      echo "  La versión compilará igual servida por HTTP; el doble clic"
      echo "  directo (file://) puede no funcionar."
    }
  else
    echo "⚠ No se encontró el chunk de runtime de turbopack."
  fi

  # --- 5) publicar ---------------------------------------------------
  echo "▶ Publicando…"
  rm -rf ../juego-web-nueva
  mv "$OUT" ../juego-web-nueva
fi

rm -rf .next

echo ""
if [ "$TARGET" = "pages" ]; then
  echo "✓ LISTO: ./out/ (artefacto para GitHub Pages)"
else
  echo "✓ LISTO: ../juego-web-nueva/index.html"
  echo "  Abrilo con doble clic o subí la carpeta a cualquier hosting estático."
fi
