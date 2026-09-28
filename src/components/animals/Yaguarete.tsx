// ============================================================
// Senda Nativa — Yaguareté (Panthera onca)
// Dorado con rosetas huecas (anillos con puntito adentro),
// orejitas redondas, hocico crema con nariz ancha rosada,
// bigotes con puntitos y cola con punta negra.
// ============================================================

import { Blush, EyePair, GroundShadow, INK, Mouth } from './shared'
import type { AnimalProps } from './shared'

const GOLD = '#E9A23B'
const GOLD_DARK = '#CE8A2A'
const ROSETTE = '#7A4A22'
const CREAM = '#FBEFD8'
const NOSE = '#C46A5A'

/** Roseta hueca estilo donut con puntito al medio. */
function Rosette({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ROSETTE} strokeWidth={r * 0.5} />
      <circle cx={cx} cy={cy} r={r * 0.3} fill={ROSETTE} />
    </g>
  )
}

export default function Yaguarete({ mood = 'normal', className }: AnimalProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Yaguareté">
      <GroundShadow y={106} w={58} />

      {/* colota con punta negra */}
      <path d="M 78 92 Q 98 92 103 78" stroke={GOLD} strokeWidth={9} strokeLinecap="round" fill="none" />
      <circle cx={103} cy={78} r={4.6} fill={INK} />

      {/* cuerpito robusto con pancita crema */}
      <ellipse cx={60} cy={85} rx={26} ry={16} fill={GOLD} />
      <ellipse cx={60} cy={88} rx={17} ry={12} fill={CREAM} />

      {/* rosetas del lomo (¡rasgo clave!) */}
      <Rosette cx={38} cy={80} r={5} />
      <Rosette cx={82} cy={80} r={5} />
      <Rosette cx={47} cy={75.5} r={4.2} />
      <Rosette cx={73} cy={75.5} r={4.2} />

      {/* patitas fuertes */}
      <rect x={37} y={90} width={14} height={10} rx={5.5} fill={GOLD} />
      <rect x={69} y={90} width={14} height={10} rx={5.5} fill={GOLD} />

      {/* orejitas redondas con interior crema */}
      <circle cx={38} cy={21} r={9} fill={GOLD} />
      <circle cx={82} cy={21} r={9} fill={GOLD} />
      <circle cx={38} cy={21} r={5} fill={CREAM} />
      <circle cx={82} cy={21} r={5} fill={CREAM} />

      {/* cabezota redondeada */}
      <circle cx={60} cy={44} r={29} fill={GOLD} />
      <path d="M 60 16 A 28 28 0 0 1 60 72 A 34.5 34.5 0 0 0 60 16 Z" fill={GOLD_DARK} opacity={0.2} />

      {/* rosetas de la frente */}
      <Rosette cx={50} cy={25} r={4} />
      <Rosette cx={70} cy={25} r={4} />

      {/* hocico crema con nariz ancha rosada-oscura */}
      <ellipse cx={60} cy={57} rx={16} ry={11.5} fill={CREAM} />
      <rect x={54} y={49.5} width={12} height={7.5} rx={3.75} fill={NOSE} />

      {/* bigotes: puntitos en el hocico y líneas finas */}
      <g fill={ROSETTE}>
        <circle cx={50} cy={55.5} r={1} />
        <circle cx={48.5} cy={58.5} r={1} />
        <circle cx={70} cy={55.5} r={1} />
        <circle cx={71.5} cy={58.5} r={1} />
      </g>
      <g stroke={ROSETTE} strokeWidth={1.2} strokeLinecap="round">
        <path d="M 48 57 L 37 55" />
        <path d="M 47.5 60.5 L 37 62.5" />
        <path d="M 72 57 L 83 55" />
        <path d="M 72.5 60.5 L 83 62.5" />
      </g>

      <EyePair mood={mood} leftX={47} rightX={73} y={40} r={7} />
      <Blush leftX={38.5} rightX={81.5} y={52} r={5} />
      <Mouth mood={mood} x={60} y={61} w={11} />
    </svg>
  )
}
