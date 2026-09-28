// ============================================================
// Senda Nativa — Mulita (Dasypus hybridus)
// Cabezita puntiaguda con orejitas para arriba y un
// caparazón abombado lleno de banditas: la excavadora
// esforzada de los campos blandos.
// ============================================================

import { Blush, EyePair, GroundShadow, INK, Mouth } from './shared'
import type { AnimalProps } from './shared'

const SHELL = '#C4907E'
const BAND = '#9A6B5E'
const BELLY = '#E8C9BC'
const EAR_IN = '#E8A396'
const LEG = '#B58274'

export default function Mulita({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Mulita">
      <GroundShadow y={106} w={54} />

      {/* colita cortita */}
      <path d="M 88 84 Q 101 86 100 95 Q 99 100 93 99 Q 87 97 85 92 Z" fill={BAND} />

      {/* pancita clara que asoma bajo el caparazón */}
      <ellipse cx={60} cy={95} rx={21} ry={7} fill={BELLY} />

      {/* caparazón abombado */}
      <path d="M 24 94 Q 24 48 60 48 Q 96 48 96 94 Z" fill={SHELL} />
      <ellipse cx={60} cy={90} rx={34} ry={6} fill={BAND} opacity={0.15} />

      {/* banditas del caparazón (¡el rasgo clave!) */}
      <g stroke={BAND} strokeWidth={8} strokeLinecap="round" fill="none">
        <path d="M 38 62 Q 60 54 82 62" />
        <path d="M 32 73 Q 60 65 88 73" />
        <path d="M 29 84 Q 60 76 91 84" />
      </g>

      {/* patitas cortas con uditas para escarbar */}
      <rect x={38} y={93} width={11} height={9} rx={4.5} fill={LEG} />
      <rect x={71} y={93} width={11} height={9} rx={4.5} fill={LEG} />
      <g fill={BELLY}>
        <path d="M 39.5 99 L 41 103 L 42.5 99 Z" />
        <path d="M 44.5 99 L 46 103 L 47.5 99 Z" />
        <path d="M 72.5 99 L 74 103 L 75.5 99 Z" />
        <path d="M 77.5 99 L 79 103 L 80.5 99 Z" />
      </g>

      {/* orejitas triangulares rosaditas */}
      <path d="M 48 14 Q 36 2 30 5 Q 29 8 35 17 Q 40 23 50 24 Z" fill={SHELL} />
      <path d="M 45 14 Q 37 6 33 7 Q 33 9 37 15 Q 40 19 46 20 Z" fill={EAR_IN} />
      <path d="M 72 14 Q 84 2 90 5 Q 91 8 85 17 Q 80 23 70 24 Z" fill={SHELL} />
      <path d="M 75 14 Q 83 6 87 7 Q 87 9 83 15 Q 80 19 74 20 Z" fill={EAR_IN} />

      {/* cabezita chica y puntiaguda */}
      <path
        d="M 38 24 Q 38 12 60 12 Q 82 12 82 24 Q 82 42 72 50 Q 60 58 48 50 Q 38 42 38 24 Z"
        fill={SHELL}
      />
      <path d="M 60 14 A 19 19 0 0 1 60 52 A 24 24 0 0 0 60 14 Z" fill="#A87866" opacity={0.18} />
      {/* placa de la frente */}
      <path
        d="M 45 21 Q 60 14 75 21"
        stroke={BAND}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />

      <EyePair mood={mood} leftX={48} rightX={72} y={30} r={5.5} />
      <Blush leftX={43} rightX={77} y={38} r={4.5} />
      <ellipse cx={60} cy={44} rx={3.6} ry={2.9} fill={INK} />
      <Mouth mood={mood} x={60} y={49} w={8.5} />
    </svg>
  )
}
