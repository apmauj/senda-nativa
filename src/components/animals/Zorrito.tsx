// ============================================================
// Senda Nativa — Zorrito de campo (Lycalopex gymnocercus)
// Orejas grandes, mejillas anchas y peludas, y su cola
// esponjosa con punta blanca: el patrullero de la pradera.
// ============================================================

import { Blush, EyePair, GroundShadow, INK, Mouth } from './shared'
import type { AnimalProps } from './shared'

const ORANGE = '#E8834A'
const ORANGE_DARK = '#D06C36'
const CREAM = '#FBEADD'
const SOCK = '#6B3F23'

export default function Zorrito({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Zorrito de campo">
      <GroundShadow y={106} w={56} />

      {/* cola esponjosa que sube por detrás, con puntita blanca */}
      <g transform="rotate(24 91 64)">
        <ellipse cx={91} cy={64} rx={11} ry={26} fill={ORANGE} />
        <ellipse cx={93} cy={68} rx={5} ry={18} fill={ORANGE_DARK} opacity={0.3} />
      </g>
      <circle cx={101} cy={41} r={8} fill={CREAM} />

      {/* cuerpito con pechera crema */}
      <ellipse cx={60} cy={85} rx={26} ry={17} fill={ORANGE} />
      <ellipse cx={60} cy={89} rx={14} ry={13} fill={CREAM} />

      {/* patitas con medias oscuras */}
      <rect x={42} y={93} width={13} height={9} rx={4.5} fill={SOCK} />
      <rect x={65} y={93} width={13} height={9} rx={4.5} fill={SOCK} />

      {/* orejas grandes puntidagas con interior crema */}
      <path d="M 50 26 Q 33 5 24 7 Q 24 12 30 22 Q 38 32 52 32 Z" fill={ORANGE} />
      <path d="M 47 24 Q 36 10 30 10 Q 30 13 34 20 Q 39 27 49 27 Z" fill={CREAM} />
      <path d="M 70 26 Q 87 5 96 7 Q 96 12 90 22 Q 82 32 68 32 Z" fill={ORANGE} />
      <path d="M 73 24 Q 84 10 90 10 Q 90 13 86 20 Q 81 27 71 27 Z" fill={CREAM} />

      {/* cabeza de mejillas anchas, más angosta hacia el hocico */}
      <path
        d="M 28 36 Q 28 14 60 14 Q 92 14 92 36 Q 92 54 78 64 Q 60 74 42 64 Q 28 54 28 36 Z"
        fill={ORANGE}
      />
      {/* pelitos de las mejillas */}
      <path d="M 32 44 L 18 49 L 35 56 Z" fill={ORANGE} />
      <path d="M 88 44 L 102 49 L 85 56 Z" fill={ORANGE} />
      <ellipse cx={87} cy={38} rx={4.5} ry={18} fill={ORANGE_DARK} opacity={0.2} />

      {/* hocico crema con naricita negra */}
      <ellipse cx={60} cy={58} rx={15} ry={11} fill={CREAM} />
      <circle cx={60} cy={52} r={4.5} fill={INK} />

      <EyePair mood={mood} leftX={46} rightX={74} y={42} r={6.5} />
      <Blush leftX={39} rightX={81} y={52} r={5} />
      <Mouth mood={mood} x={60} y={62} w={12} />
    </svg>
  )
}
