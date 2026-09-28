import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { GameResult } from '@prisma/client'
import type {
  AnimalId,
  OperationMode,
  PresetKey,
  StoredGameResult,
  StoredPlayerResult,
} from '@/lib/game/types'
import { db } from '@/lib/db'
import { CENTENA_STARTS } from '@/lib/game/presets'

// Evita caché de respuestas en la ruta
export const dynamic = 'force-dynamic'

const ANIMAL_IDS = [
  'carpincho',
  'zorrito',
  'guazubira',
  'mulita',
  'lobito',
  'lechuza',
  'yacare',
  'yaguarete',
] as const

const storedPlayerSchema = z.object({
  name: z.string().min(1).max(24),
  animalId: z.enum(ANIMAL_IDS),
  points: z.number().int().min(0),
  correct: z.number().int().min(0),
  attempts: z.number().int().min(0),
  rolls: z.number().int().min(0),
  objects: z.number().int().min(0),
  arrivalOrder: z.number().int().min(1).nullable(),
})

/** Claves de preset aceptadas al guardar (3 niveles + 10 tableros de centenas) */
const PRESET_KEYS = [
  'r1_20',
  'r1_100',
  'centenas',
  ...CENTENA_STARTS.map((h) => `centena_${h}`),
] as const

const saveGameSchema = z.object({
  presetKey: z.enum(PRESET_KEYS),
  operations: z.enum(['sumas', 'restas', 'mixto']),
  boardTiles: z.number().int().min(10).max(100),
  winnerName: z.string().min(1).max(24),
  winnerAnimalId: z.enum(ANIMAL_IDS),
  players: z.array(storedPlayerSchema).min(1).max(8),
})

/** Mapea un registro de la base al tipo compartido StoredGameResult */
function mapRowToStored(row: GameResult): StoredGameResult {
  let players: StoredPlayerResult[] = []
  try {
    const parsed: unknown = JSON.parse(row.playersJson)
    if (Array.isArray(parsed)) {
      players = parsed as StoredPlayerResult[]
    }
  } catch {
    // playersJson corrupto → lista vacía
    players = []
  }
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    presetKey: row.presetKey as PresetKey,
    operations: row.operations as OperationMode,
    boardTiles: row.boardTiles,
    winnerName: row.winnerName,
    winnerAnimalId: row.winnerAnimal as AnimalId,
    players,
  }
}

/** GET → últimas 10 partidas guardadas, de la más nueva a la más vieja */
export async function GET() {
  try {
    const rows = await db.gameResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    const partidas: StoredGameResult[] = rows.map(mapRowToStored)
    return NextResponse.json({ partidas })
  } catch {
    return NextResponse.json(
      { error: 'NO SE PUDIERON CARGAR LAS PARTIDAS' },
      { status: 500 }
    )
  }
}

/** POST → guarda una partida terminada */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'DATOS DE PARTIDA INVÁLIDOS' },
      { status: 400 }
    )
  }

  const parsed = saveGameSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'DATOS DE PARTIDA INVÁLIDOS' },
      { status: 400 }
    )
  }

  const { presetKey, operations, boardTiles, winnerName, winnerAnimalId, players } =
    parsed.data

  try {
    const created = await db.gameResult.create({
      data: {
        presetKey,
        operations,
        boardTiles,
        winnerName,
        winnerAnimal: winnerAnimalId,
        playersJson: JSON.stringify(players),
      },
    })
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'NO SE PUDO GUARDAR LA PARTIDA' },
      { status: 500 }
    )
  }
}
