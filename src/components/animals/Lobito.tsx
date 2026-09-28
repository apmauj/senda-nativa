// ============================================================
// Senda Nativa — Lobito de río (Lontra longicaudis)
// Cabeza redondeada con orejitas a los costados, hocico
// crema con bigotes largos, panza clarita con brillo y una
// colota gruesa apoyada en el piso.
// ============================================================

import { Blush, EyePair, GroundShadow, INK, Mouth } from './shared'
import type { AnimalProps } from './shared'

const CHOC = '#8A5A3C'
const CHOC_DARK = '#74482E'
const TAIL = '#7C4E33'
const CREAM = '#E8D5C2'
const SHINE = '#F4E9DC'
const EAR_IN = '#6E452C'
const WHISKER = '#5E3B26'

export default function Lobito({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Lobito de río">
      <GroundShadow y={106} w={58} />

      {/* colota larga y gruesa apoyada en el piso */}
      <path d="M 74 80 Q 102 78 113 88 Q 115 95 107 97 Q 90 101 72 96 Q 68 90 70 84 Z" fill={TAIL} />

      {/* cuerpito alargado y elegante */}
      <ellipse cx={60} cy={84} rx={28} ry={16} fill={CHOC} />
      {/* pancita clara con brillo */}
      <ellipse cx={60} cy={87} rx={17} ry={11} fill={CREAM} />
      <ellipse cx={54} cy={85} rx={5} ry={7} fill={SHINE} opacity={0.9} />

      {/* patitas cortas */}
      <rect x={43} y={90} width={11} height={10} rx={5} fill={CHOC} />
      <rect x={66} y={90} width={11} height={10} rx={5} fill={CHOC} />
      <rect x={43} y={94.5} width={11} height={5.5} rx={2.75} fill={CHOC_DARK} />
      <rect x={66} y={94.5} width={11} height={5.5} rx={2.75} fill={CHOC_DARK} />

      {/* orejitas chicas y redondas a los costados */}
      <circle cx={36} cy={29} r={6.5} fill={CHOC} />
      <circle cx={84} cy={29} r={6.5} fill={CHOC} />
      <circle cx={36} cy={28} r={3.2} fill={EAR_IN} />
      <circle cx={84} cy={28} r={3.2} fill={EAR_IN} />

      {/* cabeza redondeada y achicada */}
      <circle cx={60} cy={42} r={27} fill={CHOC} />
      <path d="M 60 15 A 27 27 0 0 1 60 69 A 33 33 0 0 0 60 15 Z" fill={CHOC_DARK} opacity={0.2} />

      {/* hocico crema bien ancho con naricita negra */}
      <ellipse cx={60} cy={55} rx={17} ry={11.5} fill={CREAM} />
      <ellipse cx={60} cy={49.5} rx={5.5} ry={4} fill={INK} />

      {/* bigotes largos */}
      <g stroke={WHISKER} strokeWidth={1.3} strokeLinecap="round">
        <path d="M 45 54 L 33 51" />
        <path d="M 44.5 58 L 32 58" />
        <path d="M 45 62 L 33 65" />
        <path d="M 75 54 L 87 51" />
        <path d="M 75.5 58 L 88 58" />
        <path d="M 75 62 L 87 65" />
      </g>

      <EyePair mood={mood} leftX={46} rightX={74} y={40} r={6.5} />
      {/* puntitos de cejas, como las nutrias de verdad */}
      <circle cx={46} cy={31} r={2} fill={SHINE} />
      <circle cx={74} cy={31} r={2} fill={SHINE} />
      <Blush leftX={40} rightX={80} y={52} r={5} />
      <Mouth mood={mood} x={60} y={58} w={11} />
    </svg>
  )
}
