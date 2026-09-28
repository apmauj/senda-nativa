# 🌾 SENDA NATIVA

**El recorrido de los animales autóctonos del Uruguay** — juego de tablero
educativo de sumas y restas para chicas y chicos de 4 a 8 años.

Tirás el dado, resolvés la cuenta y avanzás por el tablero ganando estrellas,
medallas y objetos sorpresa, junto a 8 animales autóctonos: **Carpincho,
Zorrito rojo, Guazubirá, Mulita, Lobito de río, Lechuza de campo, Yacaré y
Yaguareté.**

Este paquete trae **dos versiones** del juego:

---

## 1) `juego-web/` — la más fácil, sin instalar nada

Abrí `juego-web/index.html` con **doble clic** en cualquier navegador moderno
(Chrome, Edge, Firefox o Safari) y listo: ¡a jugar!

- Funciona **sin internet**: la fuente y todos los recursos van incluidos.
- También se puede hostear gratis en cualquier hosting estático
  (GitHub Pages, Netlify, Vercel, Cloudflare Pages…): subí **el contenido**
  de la carpeta tal cual está.
- Diferencia con la versión completa: **no guarda el historial de partidas**
  (la sección «ÚLTIMAS PARTIDAS» queda vacía y al terminar una partida no se
  guarda en ninguna base de datos).

## 2) `proyecto/` — versión completa (guarda las partidas)

Es el código fuente completo (Next.js 16 + React 19 + Prisma/SQLite).
Requiere [Bun](https://bun.sh) (recomendado) **o** Node.js 20+ con npm:

```bash
bun install          # o:  npm install
bun run db:generate  # o:  npx prisma generate
bun run db:push      # crea la base de datos db/custom.db
bun run dev          # o:  npm run dev
```

Abrí <http://localhost:3000> y a jugar. Las partidas terminadas se guardan
automáticamente en SQLite y aparecen en «ÚLTIMAS PARTIDAS» de la pantalla
de inicio.

### Regenerar la versión web estática

Si modificás el juego y querés regenerar la versión de doble clic:

```bash
bun run generar:web   # crea ../juego-web-nueva/  (Bun o Node 20+)
```

### Publicar en GitHub Pages

El workflow de GitHub Actions publica la versión estática automáticamente al
hacer push a `main`. En el repositorio, configurá **Settings → Pages → Build
and deployment → Source: GitHub Actions**. La dirección queda como
`https://<usuario>.github.io/<repositorio>/`.

La versión de Pages se exporta a `out/` con el prefijo del repositorio. Como
en la versión de doble clic, el historial de partidas no se guarda porque
GitHub Pages no ejecuta la API ni la base de datos.

---

## Cómo se juega

1. Elegí de **1 a 8 jugadores** y el animal de cada uno.
2. Elegí el nivel: **1 a 20** · **1 a 100** · **centenas hasta 1000**, o el
   **Tablero de centenas** (tablero completo de 100 casillas: 1–100, 101–200,
   … 901–1000, el que elijas del menú desplegable).
3. Elegí las operaciones: **solo sumas**, **solo restas** o **mixtas**.
4. En tu turno: tirá el dado y resolvé la cuenta para avanzar.
   - Sumas: `casilla + dado = ?`
   - Restas: `? − dado = casilla a la que tenés que llegar`
5. Acertás: avanzás y ganás **50 puntos**. Fallás: «¡casi!», sin castigo,
   probá otra vez (la opción equivocada queda deshabilitada).
6. En el camino hay casillas con **estrella (+100)**, **medalla (+250)** y
   **objetos sorpresa (+300)**: mate dorado, caparazón mágico, alas de chajá,
   perla del río, flor de ceibo y brújula mágica.
7. La partida termina cuando todos llegan a la meta; gana el ranking final
   (puntos + precisión matemática).

Hecho con Next.js 16, React 19, Tailwind CSS 4, Zustand, Framer Motion,
canvas-confetti y Prisma. ¡Que lo disfruten! 🦌🦉🐆
