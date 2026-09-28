// ============================================================
// Senda Nativa — Objetos coleccionables (sorpresas del camino)
// ============================================================

import type { CollectibleInfo } from './types'

export const COLLECTIBLES: CollectibleInfo[] = [
  {
    id: 'mate',
    name: 'MATE DORADO',
    icon: 'coffee',
    color: '#D9A419',
  },
  {
    id: 'caparazon',
    name: 'CAPARAZÓN MÁGICO',
    icon: 'shield',
    color: '#8FA05C',
  },
  {
    id: 'alas',
    name: 'ALAS DE CHAJÁ',
    icon: 'feather',
    color: '#B0855F',
  },
  {
    id: 'perla',
    name: 'PERLA DEL RÍO',
    icon: 'shell',
    color: '#D98C9F',
  },
  {
    id: 'ceibo',
    name: 'FLOR DE CEIBO',
    icon: 'flower',
    color: '#D9534F',
  },
  {
    id: 'brujula',
    name: 'BRÚJULA MÁGICA',
    icon: 'compass',
    color: '#C07A3A',
  },
]

export const COLLECTIBLES_BY_ID: Record<string, CollectibleInfo> =
  Object.fromEntries(COLLECTIBLES.map((c) => [c.id, c]))

export function randomCollectible(exclude: string[] = []): CollectibleInfo {
  const pool = COLLECTIBLES.filter((c) => !exclude.includes(c.id))
  const list = pool.length > 0 ? pool : COLLECTIBLES
  return list[Math.floor(Math.random() * list.length)]
}
