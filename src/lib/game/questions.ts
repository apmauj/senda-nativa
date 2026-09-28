// ============================================================
// Senda Nativa — Generador de preguntas (movimiento y práctica)
// ============================================================
// Módulo PURO de lógica (sin UI, sin estado global).
//  · genMovementQuestion: "¿A QUÉ CASILLA DEBÉS IR?" → from + dado,
//    opciones en ventana contigua de 4 por `step`.
//  · genPracticeQuestion: cuentas de práctica para las casillas
//    estrella/medalla, con distractores "parecidos pero diferentes"
//    (errores típicos: ±1, ±2, valor posicional ±10/±20, ±100...).

import type { OperationMode, PresetKey, Question } from './types'
import { PRESETS } from './presets'

// ------------------------------------------------------------
// IDs únicos (sin fechas)
// ------------------------------------------------------------

let idCounter = 0

/** crypto.randomUUID() con fallback a contador + sufijo random. */
export function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    // sin crypto disponible → fallback abajo
  }
  idCounter += 1
  return `q-${idCounter}-${Math.random().toString(36).slice(2, 10)}`
}

// ------------------------------------------------------------
// Helpers aleatorios privados
// ------------------------------------------------------------

/** Entero aleatorio en [min, max] (inclusive). */
function randInt(min: number, max: number): number {
  if (max < min) return min
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Mezcla Fisher–Yates (devuelve copia nueva). */
function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy
}

/** Elige un elemento al azar (null si el array está vacío). */
function pick<T>(items: readonly T[]): T | null {
  if (items.length === 0) return null
  return items[Math.floor(Math.random() * items.length)]
}

/** Elimina repetidos. */
function dedupe(values: readonly number[]): number[] {
  return [...new Set(values)]
}

// ------------------------------------------------------------
// Pregunta de MOVIMIENTO (pos + dado)
// ------------------------------------------------------------

/**
 * El jugador está en la casilla `fromNumber` y sacó `diceValue`.
 * La cuenta es fromNumber + diceValue (ej: 17 + 3 = 20).
 *
 * Opciones: ventana CONTIGUA de 4 valores (de `step` en `step`) que
 * incluye la respuesta, en orden aleatorio. Reglas:
 *  · la ventana nunca baja de 0;
 *  · nunca incluye `fromNumber` (evita la opción trivial "seguí igual");
 *  · 4 valores únicos, respuesta en posición aleatoria.
 */
export function genMovementQuestion(
  fromNumber: number,
  diceValue: number,
  step: number
): Question {
  const answer = fromNumber + diceValue
  const safeStep = step > 0 ? step : 1

  // Posición de la respuesta dentro de la ventana (0 = la más chica).
  // Probamos las 4 ventanas posibles que contienen la respuesta y nos
  // quedamos con las válidas (sin negativos y sin fromNumber adentro).
  const validOffsets: number[] = []
  for (let offset = 0; offset <= 3; offset++) {
    const start = answer - offset * safeStep
    const end = start + 3 * safeStep
    if (start < 0) continue // la ventana no baja de 0
    if (fromNumber >= start && fromNumber <= end) continue // opción trivial
    validOffsets.push(offset)
  }
  // offset=0 (ventana [answer, answer+step, ...]) siempre es válido:
  // fromNumber < answer y start = answer ≥ 0. Fallback defensivo igual.
  const offset = pick(validOffsets) ?? 0
  const start = Math.max(0, answer - offset * safeStep)
  const options = shuffle([
    start,
    start + safeStep,
    start + 2 * safeStep,
    start + 3 * safeStep,
  ])

  return {
    id: newId(),
    kind: 'movimiento',
    op: '+',
    a: fromNumber,
    b: diceValue,
    answer,
    options,
  }
}

// ------------------------------------------------------------
// Pregunta de MOVIMIENTO con resta ("? − dado = destino")
// ------------------------------------------------------------

/**
 * El jugador está en `fromNumber` y sacó `diceValue`, así que debería
 * llegar a fromNumber + diceValue (ej: 15 + 5 → llega a 20).
 * La cuenta es "? − dado = destino" (ej: "? − 5 = 20") y la respuesta
 * correcta es destino + dado (25). Los distractores son minuendos
 * parecidos: solo uno, restándole el dado, da el destino
 * (ej de opciones: 26, 24, 29 y 25).
 */
export function genSubtractionMoveQuestion(
  fromNumber: number,
  diceValue: number,
  step: number
): Question {
  const safeStep = step > 0 ? step : 1
  const targetNumber = fromNumber + diceValue
  const answer = targetNumber + diceValue
  const excluded = new Set([answer, targetNumber, fromNumber])

  const pool = [
    answer + safeStep,
    answer - safeStep,
    answer + 2 * safeStep,
    answer - 2 * safeStep,
    answer + randInt(3, 9) * safeStep,
    answer - randInt(3, 9) * safeStep,
  ]
  const candidates = dedupe(pool.filter((v) => v >= 0 && !excluded.has(v)))
  const distractors = shuffle(candidates).slice(0, 3)

  // Completar si el pool quedó con menos de 3 válidos.
  let k = 3
  while (distractors.length < 3 && k <= 60) {
    const extra = shuffle([answer + k * safeStep, answer - k * safeStep]).find(
      (v) => v >= 0 && !excluded.has(v) && !distractors.includes(v)
    )
    if (extra !== undefined) distractors.push(extra)
    k++
  }

  return {
    id: newId(),
    kind: 'movimiento',
    op: '-',
    a: targetNumber,
    b: diceValue,
    answer,
    options: shuffle([answer, ...distractors]),
    missingStart: true,
  }
}

// ------------------------------------------------------------
// Texto para leer en voz alta (speechSynthesis)
// ------------------------------------------------------------

/** Frase amigable para la voz según el tipo de pregunta. */
export function questionText(q: Question): string {
  if (q.kind === 'movimiento' && q.missingStart) {
    return `¿Qué número menos ${q.b} da ${q.a}?`
  }
  if (q.kind === 'movimiento') {
    return `${q.a} más ${q.b}. ¿A qué casilla llegás?`
  }
  return `${q.a} ${q.op === '+' ? 'más' : 'menos'} ${q.b}. ¿Cuánto es?`
}

// ------------------------------------------------------------
// Pregunta de PRÁCTICA (casillas estrella / medalla / bonus)
// ------------------------------------------------------------

/** Resuelve el modo de operaciones en una operación concreta. */
function resolveOp(operations: OperationMode): '+' | '-' {
  if (operations === 'sumas') return '+'
  if (operations === 'restas') return '-'
  return Math.random() < 0.5 ? '+' : '-'
}

/** Operandos según el preset y la operación (rangos del diseño). */
function genOperands(
  presetKey: PresetKey,
  op: '+' | '-'
): { a: number; b: number } {
  if (presetKey === 'r1_20') {
    if (op === '+') {
      // Mezcla de tamaños: mitad cuentas chicas (a 2..7) y mitad
      // medianas (a 8..12); b siempre dentro del rango permitido.
      const a = Math.random() < 0.5 ? randInt(2, 7) : randInt(8, 12)
      const bMax = Math.max(2, Math.min(12, 20 - a))
      return { a, b: randInt(2, bMax) }
    }
    // resta: a ∈ [5,20], b ∈ [1, a-1] → resultado ≥ 1
    const a = randInt(5, 20)
    return { a, b: randInt(1, a - 1) }
  }

  if (presetKey === 'r1_100') {
    if (op === '+') {
      if (Math.random() < 0.5) {
        // dos cifras + una cifra (answer ≤ 98)
        return { a: randInt(23, 89), b: randInt(4, 9) }
      }
      // dos cifras + dos cifras (answer ≤ 100)
      const a = randInt(15, 55)
      const bMax = Math.max(15, Math.min(45, 100 - a))
      return { a, b: randInt(15, bMax) }
    }
    if (Math.random() < 0.5) {
      // dos cifras − una cifra
      return { a: randInt(23, 99), b: randInt(4, 9) }
    }
    // dos cifras − dos cifras (sin pedir "prestado" forzado: b ≤ a-10)
    const a = randInt(35, 99)
    return { a, b: randInt(12, a - 10) }
  }

  if (presetKey === 'centenas') {
    // centenas sueltas: múltiplos EXACTOS de 100, hasta 1000
    if (op === '+') {
      const x = randInt(1, 8)
      const y = randInt(1, Math.max(1, 10 - x))
      return { a: x * 100, b: y * 100 }
    }
    const x = randInt(2, 10)
    const y = randInt(1, x - 1)
    return { a: x * 100, b: y * 100 }
  }

  // tableros de centenas (301..400, 601..700, …): cuentas de 3 cifras
  // con resultados dentro del tablero elegido
  const start = PRESETS[presetKey].startNumber
  const end = start + 100
  if (op === '+') {
    if (Math.random() < 0.5) {
      // 3 cifras + 1 cifra
      return { a: randInt(start + 1, end - 10), b: randInt(2, 9) }
    }
    // 3 cifras + decenas
    return { a: randInt(start + 1, start + 60), b: randInt(1, 3) * 10 }
  }
  if (Math.random() < 0.5) {
    // 3 cifras − 1 cifra
    return { a: randInt(start + 11, end), b: randInt(2, 9) }
  }
  // 3 cifras − decenas
  return { a: randInt(start + 30, end), b: randInt(1, 3) * 10 }
}

/**
 * Distractores de práctica: 3 números "parecidos pero diferentes"
 * (errores típicos de conteo y de valor posicional), filtrados ≥ 0.
 * Si el pool queda corto, se completa con answer ± k (k=1,2,3... o
 * ±100 en centenas).
 */
function genDistractors(presetKey: PresetKey, answer: number): number[] {
  let pool: number[]
  let fallbackStep: number

  if (presetKey === 'centenas') {
    pool = [100, 200, 300].flatMap((d) => [answer + d, answer - d])
    fallbackStep = 100
  } else if (presetKey.startsWith('centena_')) {
    // errores típicos de valor posicional en centenas: ±1, ±2, ±10, ±100
    pool = [1, 2, 10, 100].flatMap((d) => [answer + d, answer - d])
    fallbackStep = 10
  } else if (presetKey === 'r1_20') {
    pool = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 5]
    fallbackStep = 1
  } else {
    pool = [1, 2, 5, 10, 20].flatMap((d) => [answer + d, answer - d])
    fallbackStep = 1
  }

  const candidates = dedupe(pool.filter((v) => v >= 0 && v !== answer))
  const distractors = shuffle(candidates).slice(0, 3)

  // r1_100 y tableros de centenas: garantizar al menos un distractor
  // de VALOR POSICIONAL (±10/±20 en 2 cifras, ±10/±100 en 3 cifras)
  const positionalDeltas =
    presetKey === 'r1_100' && answer >= 20
      ? [10, 20]
      : presetKey.startsWith('centena_')
        ? [10, 100]
        : null
  if (positionalDeltas && distractors.length === 3) {
    const isPositional = (v: number) => positionalDeltas.includes(Math.abs(v - answer))
    if (!distractors.some(isPositional)) {
      const positional = candidates.filter(isPositional)
      const chosen = pick(positional)
      if (chosen !== null) {
        const idx = distractors.findIndex((v) => !isPositional(v))
        if (idx >= 0) distractors[idx] = chosen
      }
    }
  }

  // Completar si el pool quedó con menos de 3 válidos.
  let k = 1
  while (distractors.length < 3 && k <= 200) {
    const extra = shuffle([answer + k * fallbackStep, answer - k * fallbackStep]).find(
      (v) => v >= 0 && v !== answer && !distractors.includes(v)
    )
    if (extra !== undefined) distractors.push(extra)
    k++
  }

  return distractors
}

/**
 * Pregunta de práctica según preset (rango numérico) y modo de
 * operaciones. kind='practica'. 4 opciones únicas mezcladas.
 */
export function genPracticeQuestion(
  presetKey: PresetKey,
  operations: OperationMode
): Question {
  const op = resolveOp(operations)
  const { a, b } = genOperands(presetKey, op)
  const answer = op === '+' ? a + b : a - b
  const options = shuffle([answer, ...genDistractors(presetKey, answer)])
  return { id: newId(), kind: 'practica', op, a, b, answer, options }
}
