'use client'

// ============================================================
// Senda Nativa — Dado grande y amigable.
// Al tocarlo tira el dado (animación de sacudida + caras que
// cambian) y avisa al store cuando termina de rodar.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/game/store'
import { PRESETS } from '@/lib/game/presets'

const PIP_POSITIONS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 1],
    [0, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
}

function DieFace({ value, big }: { value: number; big?: boolean }) {
  const pips = PIP_POSITIONS[value] ?? PIP_POSITIONS[1]
  return (
    <div
      className={`grid h-24 w-24 grid-cols-3 grid-rows-3 rounded-2xl border-b-8 p-2.5 sm:h-28 sm:w-28 ${
        big ? 'h-24 sm:h-28' : ''
      }`}
      style={{
        background: 'linear-gradient(145deg, #FFF7E8, #FFE8C2)',
        borderColor: '#D9A83E',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.9), 0 6px 14px rgba(120, 84, 22, 0.25)',
      }}
      aria-hidden
    >
      {pips.map(([col, row], i) => (
        <span
          key={i}
          className="self-center justify-self-center rounded-full bg-stone-700"
          style={{ gridRow: row + 1, gridColumn: col + 1, width: '0.72rem', height: '0.72rem' }}
        />
      ))}
      {/* celdas vacías para mantener la grilla */}
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={`e${i}`} className="hidden" />
      ))}
    </div>
  )
}

export function Dice() {
  const phase = useGameStore((s) => s.phase)
  const dice = useGameStore((s) => s.dice)
  const tapDice = useGameStore((s) => s.tapDice)
  const diceSettled = useGameStore((s) => s.diceSettled)
  const presetKey = useGameStore((s) => s.presetKey)
  const preset = PRESETS[presetKey]

  const [flicker, setFlicker] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rolling = phase === 'rolling'

  useEffect(() => {
    if (rolling) {
      timerRef.current = setInterval(() => {
        setFlicker(1 + Math.floor(Math.random() * preset.diceMax))
      }, 90)
      timeoutRef.current = setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        diceSettled()
      }, 950)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [rolling, diceSettled, preset.diceMax])

  const canRoll = phase === 'idle'
  const value = rolling ? flicker : (dice ?? 1)

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={canRoll ? tapDice : undefined}
        disabled={!canRoll}
        aria-label={canRoll ? 'TOCÁ PARA TIRAR EL DADO' : 'DADO'}
        className={`rounded-3xl outline-none transition-transform focus-visible:ring-4 focus-visible:ring-amber-300 ${
          canRoll
            ? 'cursor-pointer hover:scale-105 active:scale-95'
            : 'cursor-default opacity-90'
        } ${rolling ? 'dice-rolling' : ''}`}
      >
        <DieFace value={value} />
      </button>
      {preset.diceUnit === 100 ? (
        <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
          DADO DE CENTENAS: CADA PUNTO VALE 100
        </p>
      ) : null}
    </div>
  )
}
