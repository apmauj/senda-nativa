import type { AnimalId, StoredGameResult } from './types'

const STORAGE_KEY = 'senda-nativa-historial'
const HISTORY_LIMIT = 10

const animalIds: AnimalId[] = [
  'carpincho',
  'zorrito',
  'guazubira',
  'mulita',
  'lobito',
  'lechuza',
  'yacare',
  'yaguarete',
]

function isStoredGameResult(value: unknown): value is StoredGameResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const game = value as Record<string, unknown>
  return (
    typeof game.id === 'string' &&
    typeof game.createdAt === 'string' &&
    Number.isFinite(Date.parse(game.createdAt)) &&
    typeof game.presetKey === 'string' &&
    (game.operations === 'sumas' ||
      game.operations === 'restas' ||
      game.operations === 'mixto') &&
    typeof game.boardTiles === 'number' &&
    typeof game.winnerName === 'string' &&
    animalIds.includes(game.winnerAnimalId as AnimalId) &&
    Array.isArray(game.players)
  )
}

export function getLocalGameHistory(): StoredGameResult[] {
  if (typeof window === 'undefined') return []

  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved)
      ? saved.filter(isStoredGameResult).slice(0, HISTORY_LIMIT)
      : []
  } catch {
    return []
  }
}

export function saveLocalGameResult(game: StoredGameResult): boolean {
  if (typeof window === 'undefined') return false

  try {
    const history = getLocalGameHistory().filter((saved) => saved.id !== game.id)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([game, ...history].slice(0, HISTORY_LIMIT))
    )
    return true
  } catch {
    return false
  }
}
