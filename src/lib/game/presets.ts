// ============================================================
// Senda Nativa — Presets de rango y constructor de tablero
// ============================================================

import type { Board, CentenaStart, PresetInfo, PresetKey, Tile } from './types'

const BASE_PRESETS: Record<'r1_20' | 'r1_100' | 'centenas', PresetInfo> = {
  r1_20: {
    key: 'r1_20',
    name: 'NIVEL 1 · HASTA 20',
    shortName: '1 A 20',
    description: 'CUENTAS CHICAS PARA EMPEZAR A JUGAR',
    emoji: '🌱',
    step: 1,
    columns: 5,
    rows: 4,
    totalTiles: 20,
    diceMax: 3,
    diceUnit: 1,
    startNumber: 0,
  },
  r1_100: {
    key: 'r1_100',
    name: 'NIVEL 2 · HASTA 100',
    shortName: '1 A 100',
    description: 'CUENTAS CON NÚMEROS DE DOS CIFRAS',
    emoji: '🌿',
    step: 1,
    columns: 10,
    rows: 5,
    totalTiles: 50,
    diceMax: 6,
    diceUnit: 1,
    startNumber: 0,
  },
  centenas: {
    key: 'centenas',
    name: 'NIVEL 3 · CENTENAS',
    shortName: 'CENTENAS HASTA 1000',
    description: 'SUMAS Y RESTAS DE A CENTENAS, HASTA 1000',
    emoji: '🌳',
    step: 100,
    columns: 5,
    rows: 2,
    totalTiles: 10,
    diceMax: 3,
    diceUnit: 100,
    startNumber: 0,
  },
}

/** Inicios de los tableros de centenas: 0 → casillas 1 a 100 … 900 → 901 a 1000 */
export const CENTENA_STARTS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

/** Tablero completo de 100 casillas para una centena (ej: 300 → 301 a 400). */
function buildCentenaPreset(h: CentenaStart): PresetInfo {
  return {
    key: `centena_${h}`,
    name: `TABLERO ${h + 1} A ${h + 100}`,
    shortName: `${h + 1} A ${h + 100}`,
    description: 'EL TABLERO COMPLETO DE 100 CASILLAS',
    emoji: '🗺️',
    step: 1,
    columns: 10,
    rows: 10,
    totalTiles: 100,
    diceMax: 6,
    diceUnit: 1,
    startNumber: h,
  }
}

const CENTENA_PRESETS = {} as Record<`centena_${CentenaStart}`, PresetInfo>
for (const h of CENTENA_STARTS) {
  CENTENA_PRESETS[`centena_${h}`] = buildCentenaPreset(h)
}

export const PRESETS: Record<PresetKey, PresetInfo> = {
  ...BASE_PRESETS,
  ...CENTENA_PRESETS,
}

/** Los 3 niveles de las tarjetas (el tablero de centenas se elige aparte) */
export const PRESET_LIST: PresetInfo[] = [
  PRESETS.r1_20,
  PRESETS.r1_100,
  PRESETS.centenas,
]

/** Tableros de centenas para el dropdown de la configuración */
export const CENTENA_PRESET_LIST: PresetInfo[] = CENTENA_STARTS.map(
  (h) => PRESETS[`centena_${h}`]
)

/** ¿Es un tablero de centenas (301..400, 601..700, …)? */
export function isCentenaBoardKey(key: PresetKey): key is `centena_${CentenaStart}` {
  return key.startsWith('centena_')
}

function setKind(tiles: Tile[], index: number, kind: Tile['kind']) {
  const tile = tiles[index - 1]
  if (tile && tile.kind === 'normal') tile.kind = kind
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Construye el tablero de un preset.
 * - Casillas estrella: múltiplos de 5 · Casillas medalla: múltiplos de 10.
 * - Bonus sorpresa: 1 casilla aleatoria por cada tramo de 10 casillas.
 * - La última casilla siempre es la META.
 * (Para centenas sueltas el reparto se hace a mano porque el tablero es chico.)
 */
export function buildBoard(presetKey: PresetKey): Board {
  const p = PRESETS[presetKey]
  const tiles: Tile[] = []
  for (let i = 1; i <= p.totalTiles; i++) {
    tiles.push({ index: i, number: p.startNumber + i * p.step, kind: 'normal' })
  }

  // meta
  tiles[p.totalTiles - 1].kind = 'meta'

  if (presetKey === 'centenas') {
    // tablero 100 → 1000 (10 casillas): reparto fijo con sentido
    setKind(tiles, 3, 'reward5')   // 300
    setKind(tiles, 7, 'reward5')   // 700
    setKind(tiles, 5, 'reward10')  // 500
    setKind(tiles, 8, 'bonus')     // 800
  } else {
    // múltiplos de 5 → estrella · múltiplos de 10 → medalla (sin pisar la
    // meta). En los tableros de centenas equivale a los números terminados
    // en 5 y en 0 (305, 310, … 395, 400).
    for (let n = 5; n < p.totalTiles; n += 5) {
      setKind(tiles, n, n % 10 === 0 ? 'reward10' : 'reward5')
    }
    // 1 bonus aleatorio por tramo de 10 casillas (solo en casillas normales)
    for (let from = 1; from < p.totalTiles; from += 10) {
      const to = Math.min(from + 9, p.totalTiles - 1)
      const candidates = tiles
        .filter((t) => t.index >= from && t.index <= to && t.kind === 'normal')
        .map((t) => t.index)
      if (candidates.length > 0) {
        const pick = candidates[randomInt(0, candidates.length - 1)]
        setKind(tiles, pick, 'bonus')
      }
    }
  }

  return {
    tiles,
    columns: p.columns,
    rows: p.rows,
    totalTiles: p.totalTiles,
    step: p.step,
    startNumber: p.startNumber,
    lastNumber: p.startNumber + p.totalTiles * p.step,
  }
}

/** Número que se muestra de una posición del recorrido (0 = salida). */
export function numberAt(board: Board, position: number): number {
  return board.startNumber + position * board.step
}

/** Coordenadas (col, row) de una casilla en el serpenteado. row 0 = fila de abajo. */
export function tileCoords(
  index: number,
  board: Board
): { col: number; row: number } {
  const zero = index - 1
  const row = Math.floor(zero / board.columns)
  const inRow = zero % board.columns
  // las filas pares van → y las impares ← (serpenteado)
  const col = row % 2 === 0 ? inRow : board.columns - 1 - inRow
  return { col, row }
}
