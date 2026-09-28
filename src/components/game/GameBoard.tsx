'use client'

// ============================================================
// Senda Nativa — Tablero serpenteante + fichas animadas.
// La grilla se dibuja de abajo hacia arriba (fila 0 abajo) y
// las fichas saltan casilla por casilla con framer-motion.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Medal, Gift, Flag } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { tileCoords } from '@/lib/game/presets'
import { getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import { playSound } from '@/lib/game/sound'
import type { PlayerState } from '@/lib/game/types'

const STRIP_H = 52
const STRIP_GAP = 8 // mt-2
const GAP = 6 // gap fijo de la grilla (horizontal y vertical)

interface Point {
  x: number
  y: number
}

function Token({
  player,
  size,
  x,
  y,
  z,
  isActive,
  isMoving,
  movingPath,
  onMoveDone,
  cellW,
}: {
  player: PlayerState
  size: number
  x: number
  y: number
  z: number
  isActive: boolean
  isMoving: boolean
  movingPath: Point[]
  onMoveDone: () => void
  cellW: number
}) {
  const animal = getAnimal(player.animalId)
  const duration = Math.max(0.16, movingPath.length * 0.19)

  useEffect(() => {
    if (!isMoving) return
    const timers = movingPath.map((_, i) =>
      setTimeout(() => playSound('hop'), (i + 1) * (duration * 1000) / movingPath.length - 60)
    )
    return () => timers.forEach(clearTimeout)
  }, [isMoving, movingPath, duration])

  return (
    <div
      className="absolute top-0 left-0"
      style={{ zIndex: z }}
      aria-hidden
    >
      <motion.div
        initial={false}
        animate={
          isMoving
            ? {
                x: [x, ...movingPath.map((p) => p.x)],
                y: [y, ...movingPath.map((p) => p.y)],
              }
            : { x, y }
        }
        transition={
          isMoving
            ? { duration, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 480, damping: 32 }
        }
        onAnimationComplete={() => {
          if (isMoving) onMoveDone()
        }}
        style={{ width: size, height: size }}
      >
        <div
          className={`relative h-full w-full ${isMoving ? 'token-hopping' : ''}`}
          style={{ animationDuration: isMoving ? `${duration / movingPath.length}s` : undefined }}
        >
          <div
            className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] bg-white shadow-md ${
              isActive && !isMoving ? 'token-active' : ''
            }`}
            style={{ borderColor: animal.color }}
          >
            <AnimalArt
              id={player.animalId}
              mood={isMoving ? 'happy' : 'normal'}
              className="h-[86%] w-[86%]"
            />
          </div>
          {player.arrived ? (
            <span
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-[10px] font-extrabold text-white shadow"
              style={{ fontSize: Math.max(10, cellW * 0.22) }}
            >
              {player.arrivalOrder}
            </span>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}

export function GameBoard() {
  const board = useGameStore((s) => s.board)
  const players = useGameStore((s) => s.players)
  const currentIdx = useGameStore((s) => s.currentIdx)
  const anim = useGameStore((s) => s.anim)
  const moveDone = useGameStore((s) => s.moveDone)

  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cellW = board && width > 0
    ? (width - (board.columns - 1) * GAP) / board.columns
    : 0
  const gridH = board ? board.rows * cellW + (board.rows - 1) * GAP : 0
  const tokenSize = Math.round(Math.min(Math.max(cellW * 0.82, 22), 54))

  // mapa de posiciones → centros en píxeles.
  // geometría del contenedor interno (sin padding):
  //   · grilla: de y=0 a y=gridH (la fila de abajo es la primera del camino)
  //   · franja salida: debajo de la grilla
  const posToXY = useMemo(() => {
    return (position: number): Point => {
      if (!board || cellW <= 0) return { x: 0, y: 0 }
      if (position === 0) {
        return {
          x: cellW * 0.55,
          y: gridH + STRIP_GAP + STRIP_H / 2,
        }
      }
      const { col, row } = tileCoords(position, board)
      return {
        x: col * (cellW + GAP) + cellW / 2,
        y: (board.rows - 1 - row) * (cellW + GAP) + cellW / 2,
      }
    }
  }, [board, cellW, gridH])

  // apilado: cuántas fichas hay por posición (para correrlas de a pares)
  const tokens = useMemo(() => {
    if (!board) return []
    const byPos = new Map<number, PlayerState[]>()
    for (const p of players) {
      const list = byPos.get(p.position) ?? []
      list.push(p)
      byPos.set(p.position, list)
    }
    return players.map((p) => {
      const group = byPos.get(p.position) ?? [p]
      const i = group.indexOf(p)
      const n = group.length
      const base = posToXY(p.position)
      const spread =
        p.position === 0
          ? Math.min(64, tokenSize * 1.05)
          : Math.min(tokenSize * 0.52, cellW * 0.42)
      const dx = n > 1 ? (i - (n - 1) / 2) * spread : 0
      const dy = p.position === 0 && n > 4 ? (i % 2 === 0 ? -10 : 10) : 0
      return { player: p, x: base.x + dx, y: base.y + dy }
    })
  }, [players, posToXY, tokenSize, cellW, board])

  // grilla de dibujo: filas de arriba hacia abajo
  const displayRows = useMemo(() => {
    if (!board) return []
    const rowsArr: (typeof board.tiles[number] | null)[][] = []
    for (let dr = 0; dr < board.rows; dr++) rowsArr.push(Array(board.columns).fill(null))
    for (const tile of board.tiles) {
      const { col, row } = tileCoords(tile.index, board)
      const displayRow = board.rows - 1 - row
      rowsArr[displayRow][col] = tile
    }
    return rowsArr
  }, [board])

  const movingPlayer = anim ? players.find((p) => p.id === anim.playerId) : null
  const movingPath: Point[] = useMemo(() => {
    if (!movingPlayer || !anim) return []
    return anim.path.map((pos) => posToXY(pos))
  }, [anim, movingPlayer, posToXY])

  if (!board) return null

  const bigCells = board.columns <= 5
  const numberClass = bigCells
    ? 'text-lg sm:text-xl md:text-2xl'
    : 'text-[11px] font-bold sm:text-sm md:text-base'

  return (
    <div
      className="relative mx-auto w-full rounded-[2rem] border-4 border-green-200 bg-gradient-to-b from-[#FBF4DE] to-[#F3E9CC] p-3 pb-2 shadow-inner sm:p-4"
      role="img"
      aria-label={`TABLERO DE ${board.totalTiles} CASILLAS HASTA LA META EN ${board.lastNumber}`}
    >
      {/* sol decorativo */}
      <span
        className="floaty absolute -top-3 right-5 z-0 select-none text-3xl sm:text-4xl"
        aria-hidden
      >
        ☀️
      </span>

      {/* contenedor interno medible (sin padding) */}
      <div ref={containerRef} className="relative">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${board.columns}, minmax(0, 1fr))`,
          gap: GAP,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {displayRows.flat().map((tile, i) => {
          if (!tile) return <div key={`empty-${i}`} />
          const kind = tile.kind
          const isMeta = kind === 'meta'
          return (
            <div
              key={tile.index}
              aria-label={`CASILLA ${tile.number}${
                kind === 'reward5'
                  ? ', ESTRELLA'
                  : kind === 'reward10'
                    ? ', MEDALLA'
                    : kind === 'bonus'
                      ? ', SORPRESA'
                      : isMeta
                        ? ', META'
                        : ''
              }`}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border-2 sm:rounded-xl sm:border-[3px] ${
                kind === 'normal'
                  ? 'border-stone-200/90 bg-[#FDFAF1] text-stone-600'
                  : kind === 'reward5'
                    ? 'border-amber-400 bg-amber-100 text-amber-700'
                    : kind === 'reward10'
                      ? 'border-orange-400 bg-orange-100 text-orange-700'
                      : kind === 'bonus'
                        ? 'border-rose-300 bg-rose-100 text-rose-500'
                        : 'border-green-700 bg-green-500 text-white shadow-md'
              }`}
            >
              {kind === 'reward5' ? (
                <Star className={bigCells ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-3 w-3 sm:h-4 sm:w-4'} aria-hidden />
              ) : null}
              {kind === 'reward10' ? (
                <Medal className={bigCells ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-3 w-3 sm:h-4 sm:w-4'} aria-hidden />
              ) : null}
              {kind === 'bonus' ? (
                <Gift className={bigCells ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-3 w-3 sm:h-4 sm:w-4'} aria-hidden />
              ) : null}
              {isMeta ? (
                <Flag className={bigCells ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-3 w-3 sm:h-4 sm:w-4'} aria-hidden />
              ) : null}
              <span
                className={`${numberClass} leading-none ${isMeta ? 'font-extrabold' : 'font-bold'}`}
              >
                {tile.number}
              </span>
              {isMeta && bigCells ? (
                <span className="text-[9px] font-extrabold tracking-widest">META</span>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* franja de salida */}
      <div
        className="mt-2 flex items-center gap-2 rounded-xl border-2 border-green-300 bg-green-100 px-3"
        style={{ height: STRIP_H, marginTop: STRIP_GAP }}
      >
        <span className="text-base font-extrabold text-green-800 sm:text-lg">🚩 SALIDA</span>
        <span
          className="h-1 flex-1 rounded"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #A7C77E 0 10px, transparent 10px 20px)',
          }}
          aria-hidden
        />
      </div>

      {/* fichas */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 2 }}>
        {tokens.map(({ player, x, y }) => {
          const isMoving = anim?.playerId === player.id
          const isActive = players[currentIdx]?.id === player.id && !player.arrived
          const z = isMoving ? 50 : isActive ? 40 : 20
          return (
            <Token
              key={player.id}
              player={player}
              size={tokenSize}
              x={x}
              y={y}
              z={z}
              isActive={isActive}
              isMoving={isMoving}
              movingPath={isMoving ? movingPath : []}
              onMoveDone={moveDone}
              cellW={cellW}
            />
          )
        })}
      </div>
      </div>
    </div>
  )
}
