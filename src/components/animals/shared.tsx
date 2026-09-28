// ============================================================
// Senda Nativa — Piezas SVG compartidas para los 8 animales.
// Todos los animales usan ESTAS piezas para ojos, boca, cachetes
// y sombra, así el estilo queda unificado.
// viewBox de cada animal: 0 0 120 120 (chibi, cabeza grande abajo
// un cuerpito, patitas cerca de y ≈ 100, sombra en y ≈ 106).
// ============================================================

import type { Mood } from '@/lib/game/types'

export interface AnimalProps {
  mood?: Mood
  className?: string
}

const INK = '#3B2A20'

/** Par de ojos con pupilas y brillo según el mood. */
export function EyePair({
  mood = 'normal',
  leftX,
  rightX,
  y,
  r = 7,
}: {
  mood?: Mood
  leftX: number
  rightX: number
  y: number
  r?: number
}) {
  if (mood === 'happy') {
    // ojos cerrados felices ∩ ∩
    return (
      <g stroke={INK} strokeWidth={r * 0.42} strokeLinecap="round" fill="none">
        <path d={`M ${leftX - r} ${y + r * 0.35} Q ${leftX} ${y - r * 0.9} ${leftX + r} ${y + r * 0.35}`} />
        <path d={`M ${rightX - r} ${y + r * 0.35} Q ${rightX} ${y - r * 0.9} ${rightX + r} ${y + r * 0.35}`} />
      </g>
    )
  }
  if (mood === 'sad') {
    // pupilas abajo, mirada triste
    return (
      <g>
        <Eye x={leftX} y={y} r={r} pupilDy={r * 0.45} />
        <Eye x={rightX} y={y} r={r} pupilDy={r * 0.45} />
      </g>
    )
  }
  const pupilScale = mood === 'wow' ? 0.32 : 0.46
  const eyeScale = mood === 'wow' ? 1.18 : 1
  return (
    <g>
      <Eye x={leftX} y={y} r={r * eyeScale} pupilDy={0} pupilScale={pupilScale} />
      <Eye x={rightX} y={y} r={r * eyeScale} pupilDy={0} pupilScale={pupilScale} />
    </g>
  )
}

function Eye({
  x,
  y,
  r,
  pupilDy,
  pupilScale = 0.46,
}: {
  x: number
  y: number
  r: number
  pupilDy: number
  pupilScale?: number
}) {
  const pr = r * pupilScale
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#FFFFFF" />
      <circle cx={x} cy={y + pupilDy} r={pr} fill={INK} />
      <circle cx={x + pr * 0.35} cy={y + pupilDy - pr * 0.35} r={pr * 0.32} fill="#FFFFFF" />
    </g>
  )
}

/** Boca según mood, centrada en (x, y). */
export function Mouth({
  mood = 'normal',
  x,
  y,
  w = 16,
}: {
  mood?: Mood
  x: number
  y: number
  w?: number
}) {
  if (mood === 'happy') {
    // sonrisa abierta con lengüita
    return (
      <g>
        <path
          d={`M ${x - w / 2} ${y} Q ${x} ${y + w * 0.95} ${x + w / 2} ${y} Z`}
          fill={INK}
        />
        <path
          d={`M ${x - w * 0.24} ${y + w * 0.42} Q ${x} ${y + w * 0.8} ${x + w * 0.24} ${y + w * 0.42} Z`}
          fill="#E8838A"
        />
      </g>
    )
  }
  if (mood === 'sad') {
    return (
      <path
        d={`M ${x - w / 2} ${y + w * 0.45} Q ${x} ${y - w * 0.2} ${x + w / 2} ${y + w * 0.45}`}
        stroke={INK}
        strokeWidth={w * 0.14}
        strokeLinecap="round"
        fill="none"
      />
    )
  }
  if (mood === 'wow') {
    return (
      <ellipse cx={x} cy={y + w * 0.18} rx={w * 0.26} ry={w * 0.34} fill={INK} />
    )
  }
  // sonrisita simple
  return (
    <path
      d={`M ${x - w / 2} ${y} Q ${x} ${y + w * 0.62} ${x + w / 2} ${y}`}
      stroke={INK}
      strokeWidth={w * 0.14}
      strokeLinecap="round"
      fill="none"
    />
  )
}

/** Cachetes rosados. */
export function Blush({
  leftX,
  rightX,
  y,
  r = 5.5,
  opacity = 0.55,
}: {
  leftX: number
  rightX: number
  y: number
  r?: number
  opacity?: number
}) {
  return (
    <g fill="#F0A1A1" opacity={opacity}>
      <circle cx={leftX} cy={y} r={r} />
      <circle cx={rightX} cy={y} r={r} />
    </g>
  )
}

/** Sombra en el piso. */
export function GroundShadow({
  y = 106,
  w = 54,
}: {
  y?: number
  w?: number
}) {
  return <ellipse cx={60} cy={y} rx={w / 2} ry={6} fill="#3B2A20" opacity={0.12} />
}

export { INK }
