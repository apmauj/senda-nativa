// ============================================================
// Senda Nativa — Registro de componentes SVG de los animales
// Nota: se usa createElement (y no JSX) porque este archivo
// es .ts; la API pública es la misma que la del contrato.
// ============================================================

import { createElement, type ComponentType } from 'react'
import type { AnimalId, Mood } from '@/lib/game/types'
import type { AnimalProps } from './shared'
import Carpincho from './Carpincho'
import Zorrito from './Zorrito'
import Guazubira from './Guazubira'
import Mulita from './Mulita'
import Lobito from './Lobito'
import Lechuza from './Lechuza'
import Yacare from './Yacare'
import Yaguarete from './Yaguarete'

export const ANIMAL_COMPONENTS: Record<AnimalId, ComponentType<AnimalProps>> = {
  carpincho: Carpincho,
  zorrito: Zorrito,
  guazubira: Guazubira,
  mulita: Mulita,
  lobito: Lobito,
  lechuza: Lechuza,
  yacare: Yacare,
  yaguarete: Yaguarete,
}

export function AnimalArt({ id, mood, className }: { id: AnimalId; mood?: Mood; className?: string }) {
  const Cmp = ANIMAL_COMPONENTS[id]
  return createElement(Cmp, { mood, className })
}
