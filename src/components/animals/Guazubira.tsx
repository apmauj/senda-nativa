// ============================================================
// Senda Nativa — Guazubirá (Mazama gouazoubira)
// Venadito tímido: orejas largas a los costados, astitas
// chiquitas, manchitas blancas en el lomo y pezuñitas oscuras.
// ============================================================

import { Blush, EyePair, GroundShadow, INK, Mouth } from './shared'
import type { AnimalProps } from './shared'

const TAN = '#C99A6B'
const TAN_DARK = '#B3834F'
const CREAM = '#F5EAD9'
const MUZZLE = '#D9B58D'
const HOOF = '#6B4A30'
const ANTLER = '#8A6B4A'
const EAR_IN = '#E7C9A8'

export default function Guazubira({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Guazubirá">
      <GroundShadow y={106} w={50} />

      {/* colita cortita con el revés blanco */}
      <ellipse cx={80} cy={68} rx={4.5} ry={6.5} transform="rotate(-35 80 68)" fill={CREAM} />

      {/* cuerpito esbelto con pancita crema */}
      <ellipse cx={60} cy={81} rx={24} ry={18} fill={TAN} />
      <ellipse cx={60} cy={85} rx={14} ry={12} fill={CREAM} />

      {/* manchitas blancas de cervatillo en el lomo */}
      <g fill={CREAM}>
        <circle cx={43} cy={73} r={2.6} />
        <circle cx={49} cy={69} r={2.6} />
        <circle cx={77} cy={73} r={2.6} />
        <circle cx={71} cy={69} r={2.6} />
        <circle cx={40} cy={79} r={2.6} />
        <circle cx={80} cy={79} r={2.6} />
      </g>

      {/* patitas finas con pezuñas oscuras */}
      <rect x={47} y={88} width={7} height={11} rx={3.5} fill={TAN} />
      <rect x={66} y={88} width={7} height={11} rx={3.5} fill={TAN} />
      <rect x={47} y={94} width={7} height={5} rx={2.5} fill={HOOF} />
      <rect x={66} y={94} width={7} height={5} rx={2.5} fill={HOOF} />

      {/* astitas simples entre las orejas */}
      <g stroke={ANTLER} strokeWidth={4} strokeLinecap="round" fill="none">
        <path d="M 53 20 Q 50 9 43 5" />
        <path d="M 67 20 Q 70 9 77 5" />
      </g>
      <g stroke={ANTLER} strokeWidth={2.8} strokeLinecap="round" fill="none">
        <path d="M 51 12 Q 46 9 42 10" />
        <path d="M 69 12 Q 74 9 78 10" />
      </g>

      {/* orejas largas y puntiagudas a los costados */}
      <path d="M 44 30 Q 28 12 18 8 Q 16 10 21 23 Q 26 34 40 42 Z" fill={TAN} />
      <path d="M 41 29 Q 30 15 23 11 Q 22 13 26 22 Q 30 31 40 37 Z" fill={EAR_IN} />
      <path d="M 76 30 Q 92 12 102 8 Q 104 10 99 23 Q 94 34 80 42 Z" fill={TAN} />
      <path d="M 79 29 Q 90 15 97 11 Q 98 13 94 22 Q 90 31 80 37 Z" fill={EAR_IN} />

      {/* cabecita redondeada */}
      <ellipse cx={60} cy={40} rx={26} ry={24} fill={TAN} />
      <path d="M 60 16 A 24 24 0 0 1 60 64 A 30 30 0 0 0 60 16 Z" fill={TAN_DARK} opacity={0.18} />

      {/* hocico alargado con naricita negra */}
      <ellipse cx={60} cy={55} rx={13} ry={9.5} fill={MUZZLE} />
      <ellipse cx={60} cy={49.5} rx={4.5} ry={3.5} fill={INK} />

      <EyePair mood={mood} leftX={48} rightX={72} y={38} r={6} />
      <Blush leftX={42} rightX={78} y={46} r={4.8} />
      <Mouth mood={mood} x={60} y={56} w={9} />
    </svg>
  )
}
