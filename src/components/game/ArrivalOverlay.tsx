'use client'

// ============================================================
// Senda Nativa — Festejo de llegada a la meta
// ============================================================

import { useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { confettiBurst } from './CelebrationOverlay'

const ORDER_LABEL = ['🥇 1º', '🥈 2º', '🥉 3º']

export function ArrivalOverlay() {
  const phase = useGameStore((s) => s.phase)
  const arrival = useGameStore((s) => s.arrival)
  const players = useGameStore((s) => s.players)
  const dismiss = useGameStore((s) => s.dismissArrival)

  const open = phase === 'arrived' && !!arrival
  const player = players.find((p) => p.id === arrival?.playerId)
  const animal = player ? getAnimal(player.animalId) : null
  const allArrived = players.length > 0 && players.every((p) => p.arrived)

  useEffect(() => {
    if (open) {
      confettiBurst(true)
      const t = setTimeout(() => dismiss(), 6500)
      return () => clearTimeout(t)
    }
  }, [open, dismiss])

  if (!open || !player || !animal || !arrival) return null

  const orderLabel =
    arrival.order <= 3 ? ORDER_LABEL[arrival.order - 1] : `${arrival.order}º`
  const subtitle = allArrived
    ? '¡TODOS LLEGARON! ¡PREMIAMOS EL ESFUERZO DE TODOS!'
    : '¡EL RESTO SIGUE JUGANDO PARA LLEGAR!'

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-md gap-4 rounded-3xl border-4 border-green-400 bg-gradient-to-b from-lime-50 to-green-100 p-7 text-center [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">
          ¡{player.name} LLEGÓ A LA META!
        </DialogTitle>
        <DialogDescription className="sr-only">{subtitle}</DialogDescription>
        <div className="flex flex-col items-center gap-3">
          <p className="text-2xl font-extrabold text-green-800">
            ¡{player.name} LLEGÓ A LA META!
          </p>
          <div className="relative">
            <span
              className="floaty flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-8 bg-white shadow-lg"
              style={{ borderColor: animal.color }}
            >
              <AnimalArt id={player.animalId} mood="happy" className="h-32 w-32" />
            </span>
            <span className="pop-in absolute -top-2 -right-4 rotate-12 rounded-2xl border-b-4 border-amber-500 bg-amber-400 px-3 py-1.5 text-xl font-extrabold text-white shadow">
              {orderLabel}
            </span>
          </div>
          <p className="text-lg font-bold text-stone-600">{subtitle}</p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-1 min-h-12 rounded-2xl border-b-4 border-green-600 bg-green-500 px-8 py-3 text-xl font-extrabold text-white transition-transform hover:-translate-y-0.5 hover:bg-green-400 active:translate-y-0.5"
          >
            {allArrived ? '¡VER RESULTADOS!' : '¡SEGUIR JUGANDO!'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
