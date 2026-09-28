'use client'

// ============================================================
// Senda Nativa — Festejo de premio (estrella / medalla / objeto)
// ============================================================

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Star, Medal, Coffee, Shield, Feather, Shell, Flower2, Compass } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CollectibleIcon } from '@/lib/game/types'

const ICONS: Record<CollectibleIcon, typeof Star> = {
  coffee: Coffee,
  shield: Shield,
  feather: Feather,
  shell: Shell,
  flower: Flower2,
  compass: Compass,
}

export function CelebrationOverlay() {
  const phase = useGameStore((s) => s.phase)
  const celebration = useGameStore((s) => s.celebration)
  const players = useGameStore((s) => s.players)
  const currentIdx = useGameStore((s) => s.currentIdx)
  const dismiss = useGameStore((s) => s.dismissCelebration)

  const open = phase === 'celebrate' && !!celebration
  const player = players[currentIdx]
  const animal = player ? getAnimal(player.animalId) : null

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => dismiss(), 3800)
    return () => clearTimeout(t)
  }, [open, dismiss])

  if (!open || !celebration || !player || !animal) return null

  const title =
    celebration.kind === 'star'
      ? '¡GANÓ UNA ESTRELLA!'
      : celebration.kind === 'medal'
        ? '¡GANÓ UNA MEDALLA!'
        : `¡ENCONTRÓ ${celebration.collectible?.name ?? 'UN OBJETO'}!`

  const Icon =
    celebration.kind === 'star'
      ? Star
      : celebration.kind === 'medal'
        ? Medal
        : ICONS[celebration.collectible?.icon ?? 'coffee']

  const iconColor =
    celebration.kind === 'object' ? (celebration.collectible?.color ?? '#D9A419') : undefined

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-md gap-4 rounded-3xl border-4 border-amber-300 bg-gradient-to-b from-amber-50 to-orange-100 p-7 text-center [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">
          {player.name} {title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          PREMIO DE {celebration.points} PUNTOS
        </DialogDescription>
        <div className="flex flex-col items-center gap-3">
          <span
            className="pop-in flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow-sm"
            style={{ borderColor: animal.color }}
          >
            <AnimalArt id={player.animalId} mood="happy" className="h-12 w-12" />
          </span>
          <p className="text-xl font-extrabold text-stone-700">
            {player.name} {title}
          </p>
          <div className="pop-in flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg">
            {celebration.kind === 'star' ? (
              <Star className="h-16 w-16 text-amber-400" aria-label="ESTRELLA" />
            ) : celebration.kind === 'medal' ? (
              <Medal className="h-16 w-16 text-orange-500" aria-label="MEDALLA" />
            ) : (
              <Icon
                className="h-16 w-16"
                style={iconColor ? { color: iconColor } : undefined}
                aria-label={celebration.collectible?.name}
              />
            )}
          </div>
          <p className="text-3xl font-extrabold text-green-700">+{celebration.points} PUNTOS</p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-1 min-h-12 rounded-2xl border-b-4 border-green-600 bg-green-500 px-8 py-3 text-xl font-extrabold text-white transition-transform hover:-translate-y-0.5 hover:bg-green-400 active:translate-y-0.5"
          >
            ¡SEGUIR!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** Rafaga de confetti reutilizable */
export function confettiBurst(strong = false) {
  const base = {
    spread: 75,
    ticks: 220,
    zIndex: 90,
    colors: ['#7CB342', '#FFB300', '#FF7043', '#F06292', '#8D6E63'],
    disableForReducedMotion: true,
  }
  if (strong) {
    confetti({ ...base, particleCount: 130, startVelocity: 42, origin: { y: 0.35 } })
    setTimeout(() => confetti({ ...base, particleCount: 70, angle: 60, origin: { x: 0, y: 0.6 } }), 250)
    setTimeout(() => confetti({ ...base, particleCount: 70, angle: 120, origin: { x: 1, y: 0.6 } }), 450)
  } else {
    confetti({ ...base, particleCount: 80, startVelocity: 32, origin: { y: 0.4 } })
  }
}
