'use client'

// ============================================================
// Senda Nativa — Modal de pregunta (movimiento o práctica).
// Filosofía del spec: nunca castigar. Si falla: "¡CASI!" y
// se reintenta (la opción equivocada queda deshabilitada).
// ============================================================

import { useEffect, useRef } from 'react'
import { Volume2, Star, Medal } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import { speak } from '@/lib/game/sound'
import { questionText } from '@/lib/game/questions'
import { numberAt, PRESETS } from '@/lib/game/presets'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function OptionsGrid() {
  const question = useGameStore((s) => s.question)
  const wrongPicks = useGameStore((s) => s.wrongPicks)
  const solved = useGameStore((s) => s.solved)
  const feedback = useGameStore((s) => s.feedback)
  const answer = useGameStore((s) => s.answer)
  if (!question) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((value) => {
          const isWrong = wrongPicks.includes(value)
          const isRight = solved && value === question.answer
          return (
            <button
              key={value}
              type="button"
              disabled={isWrong || solved}
              onClick={() => answer(value)}
              className={`min-h-16 rounded-2xl border-b-4 px-2 py-3 text-2xl font-extrabold transition-all sm:min-h-20 sm:text-3xl ${
                isWrong
                  ? 'soft-shake cursor-not-allowed border-red-300 bg-red-100 text-red-400 opacity-80'
                  : isRight
                    ? 'border-green-600 bg-green-400 text-white'
                    : 'border-amber-400 bg-amber-50 text-stone-800 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-lg active:translate-y-0.5'
              }`}
              aria-label={`OPCIÓN ${value}`}
            >
              {value}
            </button>
          )
        })}
      </div>
      {feedback ? (
        <div
          role="status"
          className={`pop-in rounded-2xl px-4 py-2.5 text-center text-xl font-extrabold ${
            feedback.kind === 'correct'
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {feedback.kind === 'correct'
            ? `${feedback.text} ${
                question.missingStart
                  ? `${question.answer} ${question.op} ${question.b} = ${question.a}`
                  : `${question.a} ${question.op} ${question.b} = ${question.answer}`
              }`
            : feedback.text}
        </div>
      ) : null}
    </div>
  )
}

export function QuestionDialog() {
  const phase = useGameStore((s) => s.phase)
  const question = useGameStore((s) => s.question)
  const solved = useGameStore((s) => s.solved)
  const dice = useGameStore((s) => s.dice)
  const players = useGameStore((s) => s.players)
  const currentIdx = useGameStore((s) => s.currentIdx)
  const board = useGameStore((s) => s.board)
  const presetKey = useGameStore((s) => s.presetKey)
  const operations = useGameStore((s) => s.operations)
  const proceedAfterCorrect = useGameStore((s) => s.proceedAfterCorrect)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = (phase === 'ask-move' || phase === 'ask-reward') && !!question
  const player = players[currentIdx]
  const animal = player ? getAnimal(player.animalId) : null

  // al acertar: mostrar el festejo un momento y seguir solos
  useEffect(() => {
    if (solved && open) {
      timerRef.current = setTimeout(() => {
        proceedAfterCorrect()
      }, 1400)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [solved, open, proceedAfterCorrect])

  if (!open || !question || !player || !animal || !board) return null

  const isMove = phase === 'ask-move'
  const fromLabel = player.position === 0 ? 'LA SALIDA' : `${numberAt(board, player.position)}`
  const diceUnit = PRESETS[presetKey].diceUnit
  const diceLabel = dice !== null ? `${dice * diceUnit}` : ''
  // con la resta el destino es `a`; con la suma el destino es la respuesta
  const landNumber = question.missingStart ? question.a : question.answer
  const reachesMeta = isMove && landNumber >= board.lastNumber && !player.arrived

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-lg gap-4 rounded-3xl border-4 border-amber-300 bg-amber-50/95 p-5 sm:p-7 [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby="question-desc"
      >
        <DialogHeader className="items-center gap-2 space-y-0 text-center">
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow-sm"
              style={{ borderColor: animal.color }}
            >
              <AnimalArt id={player.animalId} mood={solved ? 'happy' : 'normal'} className="h-12 w-12" />
            </span>
            <div className="text-left">
              <p className="text-sm font-bold text-stone-500">TURNO DE</p>
              <DialogTitle className="text-2xl leading-tight font-extrabold text-stone-800">
                {player.name}
              </DialogTitle>
            </div>
            <button
              type="button"
              onClick={() => speak(questionText(question))}
              aria-label="ESCUCHAR LA CUENTA"
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-stone-300 bg-white text-stone-600 hover:bg-amber-100"
            >
              <Volume2 className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {isMove ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-base font-bold text-stone-600">
                ESTÁS EN {fromLabel}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-base font-bold text-stone-600">
                SACASTE {diceLabel}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2">
              {question.kind === 'practica' && phase === 'ask-reward' ? (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-base font-extrabold text-amber-700">
                  {board.tiles[player.position - 1]?.kind === 'reward10' ? (
                    <>
                      <Medal className="h-5 w-5" aria-hidden /> CASILLA MEDALLA
                    </>
                  ) : (
                    <>
                      <Star className="h-5 w-5" aria-hidden /> CASILLA ESTRELLA
                    </>
                  )}
                </span>
              ) : null}
              <span className="text-base font-bold text-stone-600">
                RESOLVÉ LA CUENTA PARA GANARLA
              </span>
            </div>
          )}
          <DialogDescription id="question-desc" className="sr-only">
            {isMove
              ? `Pregunta de movimiento: ${
                  question.missingStart
                    ? `¿qué número menos ${question.b} da ${question.a}?`
                    : `${question.a} ${question.op} ${question.b}`
                }`
              : `Pregunta de práctica (${operations === 'sumas' ? 'sumas' : operations === 'restas' ? 'restas' : 'mixtas'}, preset ${presetKey})`}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-3xl bg-white px-4 py-5 text-center shadow-inner">
          <p className="text-3xl font-extrabold tracking-wide text-stone-800 sm:text-4xl">
            {question.missingStart ? (
              <>
                <span className="text-amber-600">?</span>{' '}
                <span className="text-amber-600">{question.op}</span> {question.b}{' '}
                <span className="text-amber-600">=</span> {question.a}
              </>
            ) : (
              <>
                {question.a} <span className="text-amber-600">{question.op}</span> {question.b}{' '}
                <span className="text-amber-600">=</span> ?
              </>
            )}
          </p>
          {isMove ? (
            <p className="mt-1 text-base font-bold text-stone-500">
              {reachesMeta
                ? '¡SI LLEGÁS O TE PASÁS, ENTRÁS A LA META!'
                : question.missingStart
                  ? '¡ENCONTRÁ EL NÚMERO QUE FALTA!'
                  : '¿A QUÉ CASILLA LLEGÁS?'}
            </p>
          ) : null}
        </div>

        <OptionsGrid />
      </DialogContent>
    </Dialog>
  )
}
