// ============================================================
// Senda Nativa — Lechuza de campo / lechuzón turco
// (Bubo virginianus). Cabecita muy redonda con tufos de
// plumas como orejitas, disco facial crema en forma de
// corazón, ojos grandes y piquito naranja.
// ============================================================

import { Blush, EyePair, GroundShadow, Mouth } from './shared'
import type { AnimalProps } from './shared'

const SAND = '#C7A976'
const SAND_DARK = '#AF905C'
const DISC = '#EFE0C6'
const DISC_RIM = '#E0CCA6'
const MARK = '#6B4E36'
const WING = '#B69866'
const BEAK = '#D99A4E'

export default function Lechuza({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Lechuza de campo">
      <GroundShadow y={106} w={52} />

      {/* tufos de plumas que parecen orejitas (¡rasgo clave!) */}
      <path d="M 56 16 Q 40 0 26 3 Q 24 6 30 18 Q 38 29 54 31 Z" fill={SAND} />
      <path d="M 64 16 Q 80 0 94 3 Q 96 6 90 18 Q 82 29 66 31 Z" fill={SAND} />
      {/* marquita interna de los tufos */}
      <path d="M 50 17 Q 39 7 31 6 Q 31 8 35 15 Q 39 22 49 25 Z" fill={WING} />
      <path d="M 70 17 Q 81 7 89 6 Q 89 8 85 15 Q 81 22 71 25 Z" fill={WING} />

      {/* cuerpito regordete */}
      <ellipse cx={60} cy={90} rx={24} ry={14} fill={SAND} />

      {/* alitas a los costados */}
      <ellipse cx={37} cy={89} rx={8} ry={12} transform="rotate(18 37 89)" fill={WING} />
      <ellipse cx={83} cy={89} rx={8} ry={12} transform="rotate(-18 83 89)" fill={WING} />
      <g stroke={MARK} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5}>
        <path d="M 33.5 87 Q 37 90 40.5 87" />
        <path d="M 34.5 93 Q 37 95.5 39.5 93" />
        <path d="M 79.5 87 Q 83 90 86.5 87" />
        <path d="M 80.5 93 Q 83 95.5 85.5 93" />
      </g>

      {/* pancita de plumitas */}
      <ellipse cx={60} cy={92} rx={14} ry={11} fill={DISC} />

      {/* marquitas de plumas (chevrones suaves) */}
      <g stroke={MARK} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.45}>
        <path d="M 41 74 Q 44 78 47 74" />
        <path d="M 73 74 Q 76 78 79 74" />
        <path d="M 46 80 Q 49 84 52 80" />
        <path d="M 68 80 Q 71 84 74 80" />
      </g>

      {/* patitas con garritas naranjas */}
      <rect x={46} y={95} width={13} height={4.5} rx={2.25} fill={BEAK} />
      <rect x={61} y={95} width={13} height={4.5} rx={2.25} fill={BEAK} />
      <g fill={BEAK}>
        <circle cx={48.5} cy={99} r={2.3} />
        <circle cx={52.5} cy={100.3} r={2.3} />
        <circle cx={56.5} cy={99} r={2.3} />
        <circle cx={63.5} cy={99} r={2.3} />
        <circle cx={67.5} cy={100.3} r={2.3} />
        <circle cx={71.5} cy={99} r={2.3} />
      </g>

      {/* cabecita muy redonda */}
      <circle cx={60} cy={44} r={32} fill={SAND} />
      <path d="M 60 13 A 31 31 0 0 1 60 75 A 38 38 0 0 0 60 13 Z" fill={SAND_DARK} opacity={0.2} />

      {/* disco facial en forma de corazón: dos círculos crema */}
      <circle cx={46.5} cy={50} r={17.8} fill={DISC_RIM} />
      <circle cx={73.5} cy={50} r={17.8} fill={DISC_RIM} />
      <circle cx={46.5} cy={50} r={16.2} fill={DISC} />
      <circle cx={73.5} cy={50} r={16.2} fill={DISC} />

      {/* piquito triangular naranja, entre los ojos */}
      <path d="M 60 50 L 53.5 54 Q 60 65 66.5 54 Z" fill={BEAK} />

      <EyePair mood={mood} leftX={46.5} rightX={73.5} y={48} r={8.5} />
      <Blush leftX={37} rightX={83} y={56} r={5} />
      <Mouth mood={mood} x={60} y={65.5} w={9} />
    </svg>
  )
}
