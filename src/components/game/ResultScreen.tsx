'use client'

// ============================================================
// Senda Nativa — Pantalla de resultados finales.
// La partida termina cuando TODOS llegan: podium + tabla de
// estadísticas (puntos, premios, precisión matemática).
// ============================================================

import { useEffect } from 'react'
import { Trophy, Star, Medal, Gift, RefreshCw, Settings, Home, Save, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import { Button } from '@/components/ui/button'
import { confettiBurst } from './CelebrationOverlay'

const ORDER_BADGE = ['🥇', '🥈', '🥉']

function precision(correct: number, attempts: number): string {
  if (attempts === 0) return '—'
  return `${Math.round((correct / attempts) * 100)}%`
}

export function ResultScreen() {
  const players = useGameStore((s) => s.players)
  const playAgain = useGameStore((s) => s.playAgain)
  const goScreen = useGameStore((s) => s.goScreen)
  const saveState = useGameStore((s) => s.saveState)

  const sorted = [...players].sort(
    (a, b) => (a.arrivalOrder ?? 99) - (b.arrivalOrder ?? 99)
  )
  const winner = sorted[0]

  useEffect(() => {
    confettiBurst(true)
    const t = setTimeout(() => confettiBurst(false), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="RESULTADOS FINALES"
    >
      <div className="mx-auto my-4 w-[min(96%,44rem)] rounded-[2rem] border-4 border-amber-300 bg-gradient-to-b from-amber-50 to-orange-50 p-5 shadow-2xl sm:my-8 sm:p-7">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="pop-in text-5xl" aria-hidden>
            🏆
          </span>
          <h2 className="text-3xl font-extrabold text-stone-800 sm:text-4xl">
            ¡TODOS LLEGARON!
          </h2>
          {winner ? (
            <p className="text-lg font-bold text-stone-600 sm:text-xl">
              GANÓ {winner.name} CON {winner.points} PUNTOS
            </p>
          ) : null}
          <p className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-bold text-stone-500">
            {saveState === 'saving' ? (
              <>
                <Save className="h-4 w-4" aria-hidden /> GUARDANDO PARTIDA…
              </>
            ) : saveState === 'saved' ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden /> PARTIDA GUARDADA
              </>
            ) : saveState === 'saved-local' ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden /> GUARDADA EN ESTE DISPOSITIVO
              </>
            ) : saveState === 'error' ? (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden /> NO SE PUDO GUARDAR LA PARTIDA
              </>
            ) : null}
          </p>
        </div>

        {/* podium */}
        <div className="mt-5 grid grid-cols-3 items-end gap-2 sm:gap-4">
          {sorted.slice(0, 3).map((p, i) => {
            const animal = getAnimal(p.animalId)
            const heights = ['h-32 sm:h-40', 'h-24 sm:h-32', 'h-20 sm:h-28']
            const bgs = ['from-amber-300 to-amber-200', 'from-stone-300 to-stone-200', 'from-orange-300 to-orange-200']
            return (
              <div key={p.id} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl sm:text-3xl" aria-hidden>
                  {ORDER_BADGE[i]}
                </span>
                <span
                  className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow sm:h-20 sm:w-20 ${
                    i === 0 ? 'pop-in' : ''
                  }`}
                  style={{ borderColor: animal.color }}
                >
                  <AnimalArt id={p.animalId} mood="happy" className="h-14 w-14 sm:h-18 sm:w-18" />
                </span>
                <p className="max-w-full text-xs leading-tight font-extrabold break-words text-stone-800 sm:text-base">
                  {p.name}
                </p>
                <p className="text-xs font-bold text-green-700 sm:text-sm">{p.points} PTS</p>
                <div
                  className={`flex w-full items-start justify-center rounded-t-2xl bg-gradient-to-b ${bgs[i]} ${heights[i]}`}
                  aria-hidden
                >
                  <span className="mt-1 text-3xl font-extrabold text-white/80 sm:text-4xl">
                    {i + 1}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* tabla de estadísticas */}
        <div className="custom-scrollbar mt-4 max-h-72 overflow-auto rounded-2xl border-2 border-stone-200 bg-white p-2">
          <table className="w-full min-w-[38rem] text-left text-sm sm:text-base">
            <thead>
              <tr className="text-stone-500">
                <th scope="col" className="p-2 font-extrabold">JUGADOR</th>
                <th scope="col" className="p-2 text-center font-extrabold">PUNTOS</th>
                <th scope="col" className="p-2 text-center font-extrabold" aria-label="ESTRELLAS">⭐</th>
                <th scope="col" className="p-2 text-center font-extrabold" aria-label="MEDALLAS">🏅</th>
                <th scope="col" className="p-2 text-center font-extrabold" aria-label="OBJETOS">🎁</th>
                <th scope="col" className="p-2 text-center font-extrabold">CORRECTAS</th>
                <th scope="col" className="p-2 text-center font-extrabold">TIRADAS</th>
                <th scope="col" className="p-2 text-center font-extrabold">PRECISIÓN</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const animal = getAnimal(p.animalId)
                return (
                  <tr key={p.id} className="border-t border-stone-100">
                    <th scope="row" className="p-2">
                      <span className="flex items-center gap-2 font-extrabold whitespace-nowrap text-stone-700">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full border-2"
                          style={{ borderColor: animal.color, background: animal.colorSoft }}
                          aria-hidden
                        />
                        {p.name}
                      </span>
                    </th>
                    <td className="p-2 text-center font-extrabold text-green-700">{p.points}</td>
                    <td className="p-2 text-center font-bold text-stone-600">
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 text-amber-500" aria-hidden /> {p.stars}
                      </span>
                    </td>
                    <td className="p-2 text-center font-bold text-stone-600">
                      <span className="inline-flex items-center gap-0.5">
                        <Medal className="h-3.5 w-3.5 text-orange-500" aria-hidden /> {p.medals}
                      </span>
                    </td>
                    <td className="p-2 text-center font-bold text-stone-600">
                      <span className="inline-flex items-center gap-0.5">
                        <Gift className="h-3.5 w-3.5 text-rose-400" aria-hidden /> {p.objects.length}
                      </span>
                    </td>
                    <td className="p-2 text-center font-bold text-stone-600">{p.correct}</td>
                    <td className="p-2 text-center font-bold text-stone-600">{p.rolls}</td>
                    <td className="p-2 text-center font-extrabold text-stone-800">
                      {precision(p.correct, p.attempts)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* botones */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={playAgain}
            className="min-h-13 rounded-2xl border-b-4 border-green-700 bg-green-500 px-6 py-3 text-lg font-extrabold text-white hover:bg-green-400 sm:text-xl"
          >
            <RefreshCw className="mr-1.5 h-5 w-5" aria-hidden /> ¡JUGAR OTRA VEZ!
          </Button>
          <Button
            onClick={() => goScreen('config')}
            variant="outline"
            className="min-h-13 rounded-2xl border-2 border-stone-300 bg-white px-6 py-3 text-lg font-extrabold text-stone-700 hover:bg-amber-100 sm:text-xl"
          >
            <Settings className="mr-1.5 h-5 w-5" aria-hidden /> CAMBIAR CONFIG
          </Button>
          <Button
            onClick={() => goScreen('home')}
            variant="outline"
            className="min-h-13 rounded-2xl border-2 border-stone-300 bg-white px-6 py-3 text-lg font-extrabold text-stone-700 hover:bg-amber-100 sm:text-xl"
          >
            <Home className="mr-1.5 h-5 w-5" aria-hidden /> INICIO
          </Button>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-bold text-stone-500">
          <Trophy className="h-4 w-4 text-amber-500" aria-hidden />
          PRECISIÓN = RESPUESTAS CORRECTAS ÷ INTENTOS × 100
        </p>
      </div>
    </div>
  )
}
