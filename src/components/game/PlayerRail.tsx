'use client'

// ============================================================
// Senda Nativa — Riel de jugadores (chips compactos del HUD)
// ============================================================

import { Star, Medal, Gift } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import { numberAt } from '@/lib/game/presets'

export function PlayerRail() {
  const players = useGameStore((s) => s.players)
  const currentIdx = useGameStore((s) => s.currentIdx)
  const board = useGameStore((s) => s.board)

  if (players.length === 0 || !board) return null

  return (
    <div
      className="custom-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
      role="list"
      aria-label="JUGADORES"
    >
      {players.map((p, i) => {
        const animal = getAnimal(p.animalId)
        const active = i === currentIdx && !p.arrived
        return (
          <div
            key={p.id}
            role="listitem"
            aria-label={`${p.name}, ${p.points} PUNTOS, CASILLA ${
              p.position === 0 ? 'SALIDA' : numberAt(board, p.position)
            }`}
            className={`flex min-w-32 shrink-0 items-center gap-2 rounded-2xl border-2 px-2.5 py-1.5 transition-all ${
              p.arrived
                ? 'border-green-400 bg-green-50'
                : active
                  ? 'scale-[1.03] border-amber-400 bg-amber-100 shadow-md'
                  : 'border-stone-200 bg-white'
            }`}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-white"
              style={{ borderColor: animal.color }}
            >
              <AnimalArt id={p.animalId} mood={p.arrived ? 'happy' : 'normal'} className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm leading-tight font-extrabold text-stone-700">
                {p.name}
              </p>
              <p className="text-xs font-bold text-stone-500">
                {p.arrived ? '¡META! ' : p.position === 0 ? 'SALIDA · ' : `CAS. ${numberAt(board, p.position)} · `}
                {p.points} PTS
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5 text-[10px] font-bold leading-none text-stone-500">
              {p.stars > 0 ? (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-500" aria-hidden />
                  {p.stars}
                </span>
              ) : null}
              {p.medals > 0 ? (
                <span className="flex items-center gap-0.5">
                  <Medal className="h-3 w-3 text-orange-500" aria-hidden />
                  {p.medals}
                </span>
              ) : null}
              {p.objects.length > 0 ? (
                <span className="flex items-center gap-0.5">
                  <Gift className="h-3 w-3 text-rose-400" aria-hidden />
                  {p.objects.length}
                </span>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
