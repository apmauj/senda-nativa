// ============================================================
// Senda Nativa — Carpincho (Hydrochoerus hydrochaeris)
// Cabeza cuadrada, hocicazo chato con fosas nasales, orejitas
// chiquitas y mucho bigote. El más tranquilo del bañado.
// ============================================================

import { Blush, EyePair, GroundShadow, INK, Mouth } from './shared'
import type { AnimalProps } from './shared'

const FUR = '#A9744F'
const FUR_DARK = '#8F6141'
const SNOUT = '#C89B72'
const EAR_IN = '#D9B08C'
const FOOT = '#9A6B47'
const WHISKER = '#7A5236'

export default function Carpincho({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Carpincho">
      {/* sombra en el piso */}
      <GroundShadow y={106} w={58} />

      {/* cuerpito rechoncho con pancita clara */}
      <ellipse cx={60} cy={84} rx={27} ry={17} fill={FUR} />
      <ellipse cx={60} cy={88} rx={17} ry={12} fill={SNOUT} />

      {/* patitas cortas */}
      <rect x={41} y={92} width={12} height={10} rx={5} fill={FOOT} />
      <rect x={67} y={92} width={12} height={10} rx={5} fill={FOOT} />

      {/* orejitas chiquitas redondas, bien juntas arriba */}
      <circle cx={44} cy={13} r={6.5} fill={FUR} />
      <circle cx={76} cy={13} r={6.5} fill={FUR} />
      <circle cx={44} cy={12} r={3.3} fill={EAR_IN} />
      <circle cx={76} cy={12} r={3.3} fill={EAR_IN} />

      {/* cabeza rectangular redondeada (¡bien capyincha!) */}
      <rect x={22} y={16} width={76} height={56} rx={18} fill={FUR} />
      <ellipse cx={91} cy={44} rx={5} ry={20} fill={FUR_DARK} opacity={0.22} />

      {/* hocicazo grande y chato que sobresale de la cara */}
      <rect x={36} y={44} width={48} height={30} rx={14} fill={SNOUT} />
      <ellipse cx={52} cy={54} rx={2.6} ry={4} fill={INK} />
      <ellipse cx={68} cy={54} rx={2.6} ry={4} fill={INK} />

      {/* bigotes */}
      <g stroke={WHISKER} strokeWidth={1.4} strokeLinecap="round">
        <path d="M 36 53 L 25 50" />
        <path d="M 35 57.5 L 23 57.5" />
        <path d="M 36 62 L 25 65" />
        <path d="M 84 53 L 95 50" />
        <path d="M 85 57.5 L 97 57.5" />
        <path d="M 84 62 L 95 65" />
      </g>

      {/* carita */}
      <EyePair mood={mood} leftX={45} rightX={75} y={38} r={6.5} />
      <Blush leftX={34} rightX={86} y={52} r={5} />
      <Mouth mood={mood} x={60} y={63} w={12} />
    </svg>
  )
}
