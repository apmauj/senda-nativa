// ============================================================
// Senda Nativa — Tipos compartidos del juego
// ============================================================

export type AnimalId =
  | 'carpincho'
  | 'zorrito'
  | 'guazubira'
  | 'mulita'
  | 'lobito'
  | 'lechuza'
  | 'yacare'
  | 'yaguarete'

/** Estado de ánimo del animal (para las caritas SVG) */
export type Mood = 'normal' | 'happy' | 'sad' | 'wow'

/** Inicio de un tablero de centenas: 0 → casillas 1 a 100 … 900 → 901 a 1000 */
export type CentenaStart = 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type PresetKey = 'r1_20' | 'r1_100' | 'centenas' | `centena_${CentenaStart}`

export type OperationMode = 'sumas' | 'restas' | 'mixto'

export type TileKind = 'normal' | 'reward5' | 'reward10' | 'bonus' | 'meta'

export interface AnimalInfo {
  id: AnimalId
  name: string
  scientificName: string
  nickname: string
  personality: string
  habitat: string
  funFact: string
  conservation: string
  /** color principal del aro de la ficha */
  color: string
  /** fondo suave asociado */
  colorSoft: string
}

export interface Tile {
  /** 1..totalTiles */
  index: number
  /** número que se muestra en la casilla */
  number: number
  kind: TileKind
}

export interface Board {
  tiles: Tile[]
  columns: number
  rows: number
  totalTiles: number
  /** paso entre casillas (1 o 100) */
  step: number
  /** número "de la salida" (número de la casilla 1 menos el paso) */
  startNumber: number
  /** número de la casilla meta */
  lastNumber: number
}

export interface PresetInfo {
  key: PresetKey
  name: string
  shortName: string
  description: string
  emoji: string
  /** paso numérico entre casillas */
  step: number
  columns: number
  rows: number
  totalTiles: number
  /** cara máxima del dado (pips) */
  diceMax: number
  /** cuánto vale cada pip del dado (1 o 100) */
  diceUnit: number
  /** número de la casilla 1 menos el paso (0 en 1..N, 300 en 301..400) */
  startNumber: number
}

export interface Question {
  id: string
  /** movimiento = avance del turno · practica = cuenta del rango configurado */
  kind: 'movimiento' | 'practica'
  op: '+' | '-'
  a: number
  b: number
  answer: number
  /** 4 números únicos, incluye answer, orden aleatorio */
  options: number[]
  /**
   * Movimiento con resta: la incógnita es el minuendo. Se muestra
   * "? − b = a" y la respuesta correcta es a + b (ej: "? − 5 = 20" → 25).
   */
  missingStart?: boolean
}

export interface GameConfig {
  presetKey: PresetKey
  operations: OperationMode
}

export interface PlayerSetup {
  id: string
  name: string
  animalId: AnimalId
}

export interface PlayerState {
  id: string
  name: string
  animalId: AnimalId
  /** 0 = salida · 1..totalTiles = casilla */
  position: number
  points: number
  rolls: number
  /** clics en opciones (incluye reintentos) */
  attempts: number
  /** clics correctos (incluye el exitoso tras reintentos) */
  correct: number
  stars: number
  medals: number
  /** ids de objetos coleccionables */
  objects: string[]
  arrived: boolean
  arrivalOrder: number | null
}

export type CollectibleIcon =
  | 'coffee'
  | 'shield'
  | 'feather'
  | 'shell'
  | 'flower'
  | 'compass'

export interface CollectibleInfo {
  id: string
  name: string
  icon: CollectibleIcon
  color: string
}

/** Resultado guardado en la base de datos */
export interface StoredPlayerResult {
  name: string
  animalId: AnimalId
  points: number
  correct: number
  attempts: number
  rolls: number
  objects: number
  arrivalOrder: number | null
}

export interface StoredGameResult {
  id: string
  createdAt: string
  presetKey: PresetKey
  operations: OperationMode
  boardTiles: number
  winnerName: string
  winnerAnimalId: AnimalId
  players: StoredPlayerResult[]
}
