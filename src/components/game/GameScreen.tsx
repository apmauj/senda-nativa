'use client'

// ============================================================
// Senda Nativa — Pantalla de juego (HUD + tablero + dado)
// ============================================================

import { LogOut, Star, Medal, Gift, Dices } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import { COLLECTIBLES_BY_ID } from '@/lib/game/objects'
import { numberAt, PRESETS } from '@/lib/game/presets'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { SoundToggle } from './SoundToggle'
import { Dice } from './Dice'
import { GameBoard } from './GameBoard'
import { PlayerRail } from './PlayerRail'
import { QuestionDialog } from './QuestionDialog'
import { CelebrationOverlay } from './CelebrationOverlay'
import { ArrivalOverlay } from './ArrivalOverlay'
import { ResultScreen } from './ResultScreen'

const OP_LABEL: Record<string, string> = {
  sumas: 'SUMAS',
  restas: 'RESTAS',
  mixto: 'SUMAS Y RESTAS',
}

function TurnCard() {
  const players = useGameStore((s) => s.players)
  const currentIdx = useGameStore((s) => s.currentIdx)
  const board = useGameStore((s) => s.board)
  const player = players[currentIdx]
  if (!player || !board) return null
  const animal = getAnimal(player.animalId)

  return (
    <div
      className="flex items-center gap-3 rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:gap-4 sm:p-4"
      aria-label={`TURNO DE ${player.name}`}
    >
      <span
        className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow-sm sm:h-20 sm:w-20"
        style={{ borderColor: animal.color }}
      >
        <AnimalArt id={player.animalId} mood="happy" className="h-14 w-14 sm:h-18 sm:w-18" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-stone-500">ES TU TURNO</p>
        <p className="truncate text-xl leading-tight font-extrabold text-stone-800 sm:text-2xl">
          {player.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-stone-600 sm:text-base">
          <span>
            CASILLA:{' '}
            <span className="text-stone-800">{player.position === 0 ? 'SALIDA' : numberAt(board, player.position)}</span>
          </span>
          <span>
            PUNTOS: <span className="text-green-700">{player.points}</span>
          </span>
          <span>
            TIRADAS: <span className="text-stone-800">{player.rolls}</span>
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1" aria-label="PREMIOS">
        <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-sm font-extrabold text-amber-600 shadow-sm">
          <Star className="h-4 w-4" aria-hidden /> {player.stars}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-sm font-extrabold text-orange-600 shadow-sm">
          <Medal className="h-4 w-4" aria-hidden /> {player.medals}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-sm font-extrabold text-rose-500 shadow-sm">
          <Gift className="h-4 w-4" aria-hidden /> {player.objects.length}
        </span>
        {player.objects.length > 0 ? (
          <span className="flex gap-1 pt-0.5">
            {player.objects.map((oid, i) => {
              const c = COLLECTIBLES_BY_ID[oid]
              if (!c) return null
              return (
                <span
                  key={`${oid}-${i}`}
                  title={c.name}
                  aria-label={c.name}
                  className="h-2.5 w-2.5 rounded-full border border-white shadow-sm"
                  style={{ background: c.color }}
                />
              )
            })}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function StatusMessage() {
  const phase = useGameStore((s) => s.phase)
  const players = useGameStore((s) => s.players)
  const currentIdx = useGameStore((s) => s.currentIdx)
  const player = players[currentIdx]

  let text = 'TOCÁ EL DADO PARA AVANZAR'
  if (phase === 'rolling') text = '¡GIRANDO EL DADO!'
  else if (phase === 'ask-move' || phase === 'ask-reward') text = '¡RESOLVÉ LA CUENTA!'
  else if (phase === 'moving') text = `¡${player?.name ?? ''} AVANZA!`
  else if (phase === 'celebrate') text = '¡PREMIO!'
  else if (phase === 'arrived') text = '¡LLEGÓ A LA META!'

  return (
    <p
      className="flex min-h-9 items-center justify-center gap-2 text-center text-lg font-extrabold text-stone-600 sm:text-xl"
      role="status"
      aria-live="polite"
    >
      <Dices className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
      {text}
    </p>
  )
}

export function GameScreen() {
  const presetKey = useGameStore((s) => s.presetKey)
  const operations = useGameStore((s) => s.operations)
  const exitGame = useGameStore((s) => s.exitGame)
  const phase = useGameStore((s) => s.phase)
  const preset = PRESETS[presetKey]

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      {/* barra superior */}
      <div className="flex items-center justify-between gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="h-11 rounded-full border-2 border-stone-300 bg-white px-4 font-extrabold text-stone-700 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-1 h-5 w-5" aria-hidden /> SALIR
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm rounded-3xl border-4 border-amber-300 bg-amber-50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl text-stone-800">
                ¿SALIR DE LA PARTIDA?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base font-bold text-stone-600">
                SE VA A PERDER EL PROGRESO DE ESTA PARTIDA
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-2 sm:justify-center">
              <AlertDialogCancel className="mt-0 min-h-12 flex-1 rounded-2xl border-2 border-stone-300 bg-white text-base font-extrabold text-stone-700">
                SEGUIR JUGANDO
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={exitGame}
                className="min-h-12 flex-1 rounded-2xl border-b-4 border-red-600 bg-red-500 text-base font-extrabold text-white hover:bg-red-400"
              >
                SÍ, SALIR
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-full border-2 border-green-300 bg-green-50 px-3 py-1.5 text-sm font-extrabold text-green-800">
            {preset.emoji} {preset.shortName}
          </span>
          <span className="hidden rounded-full border-2 border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-extrabold text-amber-700 sm:inline">
            {OP_LABEL[operations]}
          </span>
        </div>

        <SoundToggle />
      </div>

      <PlayerRail />
      <TurnCard />

      <GameBoard />

      <div className="mt-1 flex flex-col items-center gap-3 pb-2">
        <StatusMessage />
        <Dice />
      </div>

      {/* overlays */}
      <QuestionDialog />
      <CelebrationOverlay />
      <ArrivalOverlay />
      {phase === 'finished' ? <ResultScreen /> : null}
    </div>
  )
}
