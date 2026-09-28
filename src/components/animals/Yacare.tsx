// ============================================================
// Senda Nativa — Yacaré overo (Caiman latirostris)
// Hocico largo y redondeado, ojos elevados sobre la cabeza,
// sonrisa fija con dientitos blancos, cresta de escamas en
// el lomo y colota gruesa a un costado.
// ============================================================

import { Blush, EyePair, GroundShadow, Mouth } from './shared'
import type { AnimalProps } from './shared'

const OLIVE = '#7C8F56'
const OLIVE_LIGHT = '#8A9C63'
const OLIVE_DARK = '#68794A'
const BELLY = '#C9CE94'
const BELLY_LINE = '#B4BA7E'
const RIDGE = '#5E6F40'
const TAIL = '#72854F'
const NOSTRIL = '#4E5C36'
const TEETH = '#F6F7EE'
const CLAW = '#DDE2B4'

export default function Yacare({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Yacaré overo">
      <GroundShadow y={106} w={60} />

      {/* colota gruesa a un costado, con escamitas */}
      <path d="M 40 88 Q 18 90 9 98 Q 7 103 14 103 Q 28 103 42 99 Z" fill={TAIL} />
      <g fill={RIDGE}>
        <path d="M 15 93 L 18.5 85.5 L 22 92 Z" />
        <path d="M 24 92 L 27.5 84.5 L 31 91.5 Z" />
      </g>

      {/* cresta de escamas sobre el lomo */}
      <g fill={RIDGE}>
        <path d="M 30 81 L 33.5 67 L 37 80 Z" />
        <path d="M 90 81 L 86.5 67 L 83 80 Z" />
      </g>

      {/* cuerpito rechoncho con pancita clara */}
      <ellipse cx={60} cy={86} rx={26} ry={15} fill={OLIVE} />
      <ellipse cx={60} cy={89} rx={16} ry={10.5} fill={BELLY} />
      <g stroke={BELLY_LINE} strokeWidth={1.6} strokeLinecap="round" fill="none">
        <path d="M 48 86.5 Q 60 82.5 72 86.5" />
        <path d="M 47 91.5 Q 60 87.5 73 91.5" />
      </g>

      {/* patitas cortas con garritas */}
      <rect x={38} y={91} width={13} height={10} rx={5.5} fill={OLIVE} />
      <rect x={69} y={91} width={13} height={10} rx={5.5} fill={OLIVE} />
      <g fill={CLAW}>
        <path d="M 40 99 L 41.5 102.5 L 43 99 Z" />
        <path d="M 45 99 L 46.5 102.5 L 48 99 Z" />
        <path d="M 71 99 L 72.5 102.5 L 74 99 Z" />
        <path d="M 76 99 L 77.5 102.5 L 79 99 Z" />
      </g>

      {/* cabeza alargada */}
      <ellipse cx={60} cy={40} rx={28} ry={24} fill={OLIVE} />
      <path d="M 60 16 A 24 24 0 0 1 60 64 A 30 30 0 0 0 60 16 Z" fill={OLIVE_DARK} opacity={0.22} />

      {/* hocico largo y redondeado */}
      <rect x={38} y={44} width={44} height={30} rx={15} fill={OLIVE_LIGHT} />
      {/* fosas nasales arriba del hocico */}
      <ellipse cx={52} cy={50} rx={2.3} ry={3.2} fill={NOSTRIL} />
      <ellipse cx={68} cy={50} rx={2.3} ry={3.2} fill={NOSTRIL} />

      {/* ojos elevados sobre la cabeza */}
      <circle cx={46} cy={26} r={8} fill={OLIVE_LIGHT} />
      <circle cx={74} cy={26} r={8} fill={OLIVE_LIGHT} />
      <EyePair mood={mood} leftX={46} rightX={74} y={26} r={6} />

      <Blush leftX={41} rightX={79} y={54} r={5} />
      <Mouth mood={mood} x={60} y={60} w={14} />
      {/* dientitos blancos de la sonrisa fija */}
      <g fill={TEETH}>
        <path d="M 52.5 56.5 L 55 61.5 L 57.5 56.5 Z" />
        <path d="M 58 57.3 L 60.5 62.3 L 63 57.3 Z" />
        <path d="M 63.5 56.5 L 66 61.5 L 68.5 56.5 Z" />
      </g>
    </svg>
  )
}
