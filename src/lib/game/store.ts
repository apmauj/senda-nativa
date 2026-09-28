// ============================================================
// Senda Nativa — Store del juego (zustand)
// Máquina de turnos: idle → rolling → ask-move → moving →
// (ask-reward | celebrate) → siguiente jugador … hasta que
// TODOS llegan a la meta.
// ============================================================

import { create } from 'zustand'
import { buildBoard, PRESETS } from './presets'
import {
  genMovementQuestion,
  genPracticeQuestion,
  genSubtractionMoveQuestion,
  newId,
  questionText,
} from './questions'
import { randomCollectible } from './objects'
import { isSoundEnabled, playSound, setSoundEnabled, speak } from './sound'
import type {
  Board,
  CollectibleInfo,
  OperationMode,
  PlayerSetup,
  PlayerState,
  PresetKey,
  Question,
} from './types'
import { ANIMALS, getAnimal } from './animals'

export type Screen = 'home' | 'config' | 'game'

export type Phase =
  | 'idle' // esperando que el jugador toque el dado
  | 'rolling' // el dado está girando
  | 'ask-move' // pregunta de movimiento abierta
  | 'ask-reward' // pregunta de casilla estrella/medalla abierta
  | 'moving' // la ficha está saltando casillas
  | 'celebrate' // premio en pantalla (estrella/medalla/objeto)
  | 'arrived' // festejo de llegada a la meta
  | 'finished' // todos llegaron: resultados

export interface Celebration {
  kind: 'star' | 'medal' | 'object'
  points: number
  collectible?: CollectibleInfo
}

const PRAISE = ['¡GENIAL!', '¡MUY BIEN!', '¡EXCELENTE!', '¡ASÍ ES!', '¡ESO ES!', '¡BRILLANTE!']
const NEARLY = ['¡CASI!', '¡UI, CASI!', '¡INTENTÁ OTRA VEZ!', '¡UNA MÁS!', '¡VAMOS QUE SE PUEDE!']

function praise() {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)]
}
function nearly() {
  return NEARLY[Math.floor(Math.random() * NEARLY.length)]
}

function defaultSetups(count: number, existing: PlayerSetup[]): PlayerSetup[] {
  const result: PlayerSetup[] = []
  for (let i = 0; i < count; i++) {
    const prev = existing[i]
    if (prev) {
      result.push(prev)
      continue
    }
    const taken = new Set(result.map((p) => p.animalId))
    const free = ANIMALS.find((a) => !taken.has(a.id)) ?? ANIMALS[i % ANIMALS.length]
    result.push({ id: newId(), name: '', animalId: free.id })
  }
  return result
}

interface GameState {
  // configuración
  screen: Screen
  presetKey: PresetKey
  operations: OperationMode
  playerCount: number
  setups: PlayerSetup[]

  // partida
  board: Board | null
  players: PlayerState[]
  currentIdx: number
  phase: Phase
  dice: number | null
  question: Question | null
  wrongPicks: number[]
  solved: boolean
  feedback: { kind: 'casi' | 'correct'; text: string } | null
  anim: { playerId: string; path: number[] } | null
  celebration: Celebration | null
  arrival: { playerId: string; order: number } | null
  arrivalCounter: number
  soundOn: boolean
  saveState: 'idle' | 'saving' | 'saved' | 'error'

  // acciones
  goScreen: (s: Screen) => void
  setPreset: (k: PresetKey) => void
  setOperations: (o: OperationMode) => void
  setPlayerCount: (n: number) => void
  setPlayerAnimal: (idx: number, animalId: PlayerSetup['animalId']) => void
  setPlayerName: (idx: number, name: string) => void
  startGame: () => void
  tapDice: () => void
  diceSettled: () => void
  answer: (value: number) => void
  proceedAfterCorrect: () => void
  moveDone: () => void
  dismissCelebration: () => void
  dismissArrival: () => void
  playAgain: () => void
  exitGame: () => void
  toggleSound: () => void
  nextTurn: () => void
  finishGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'home',
  presetKey: 'r1_20',
  operations: 'mixto',
  playerCount: 2,
  setups: defaultSetups(2, []),

  board: null,
  players: [],
  currentIdx: 0,
  phase: 'idle',
  dice: null,
  question: null,
  wrongPicks: [],
  solved: false,
  feedback: null,
  anim: null,
  celebration: null,
  arrival: null,
  arrivalCounter: 0,
  soundOn: true,
  saveState: 'idle',

  goScreen: (s) => set({ screen: s }),

  setPreset: (k) => set({ presetKey: k }),

  setOperations: (o) => set({ operations: o }),

  setPlayerCount: (n) => {
    const count = Math.max(1, Math.min(8, n))
    set({
      playerCount: count,
      setups: defaultSetups(count, get().setups),
    })
  },

  setPlayerAnimal: (idx, animalId) => {
    const setups = [...get().setups]
    if (!setups[idx]) return
    const takenByOther = setups.some((p, i) => i !== idx && p.animalId === animalId)
    if (takenByOther) return
    setups[idx] = { ...setups[idx], animalId }
    set({ setups })
  },

  setPlayerName: (idx, name) => {
    const setups = [...get().setups]
    if (!setups[idx]) return
    setups[idx] = { ...setups[idx], name: name.toUpperCase().slice(0, 16) }
    set({ setups })
  },

  startGame: () => {
    const { setups, presetKey } = get()
    const board = buildBoard(presetKey)
    const players: PlayerState[] = setups.map((s) => ({
      id: s.id,
      name: (s.name.trim() || getAnimal(s.animalId).name).toUpperCase(),
      animalId: s.animalId,
      position: 0,
      points: 0,
      rolls: 0,
      attempts: 0,
      correct: 0,
      stars: 0,
      medals: 0,
      objects: [],
      arrived: false,
      arrivalOrder: null,
    }))
    playSound('click')
    set({
      board,
      players,
      currentIdx: 0,
      phase: 'idle',
      dice: null,
      question: null,
      wrongPicks: [],
      solved: false,
      feedback: null,
      anim: null,
      celebration: null,
      arrival: null,
      arrivalCounter: 0,
      saveState: 'idle',
      screen: 'game',
    })
  },

  tapDice: () => {
    const { phase, players, currentIdx } = get()
    if (phase !== 'idle') return
    const player = players[currentIdx]
    if (!player || player.arrived) return
    const preset = PRESETS[get().presetKey]
    const face = 1 + Math.floor(Math.random() * preset.diceMax)
    playSound('dice')
    set({ dice: face, phase: 'rolling' })
  },

  diceSettled: () => {
    const { phase, dice, players, currentIdx, board, presetKey, operations } = get()
    if (phase !== 'rolling' || dice === null || !board) return
    const player = players[currentIdx]
    const preset = PRESETS[presetKey]
    const fromNumber = board.startNumber + player.position * board.step
    const diceValue = dice * preset.diceUnit
    // sumas → "casilla + dado = ?" · restas → "? − dado = casilla de llegada"
    // · mixto → una de las dos al azar
    const askSubtraction =
      operations === 'restas' || (operations === 'mixto' && Math.random() < 0.5)
    const q = askSubtraction
      ? genSubtractionMoveQuestion(fromNumber, diceValue, board.step)
      : genMovementQuestion(fromNumber, diceValue, board.step)
    set({
      question: q,
      phase: 'ask-move',
      wrongPicks: [],
      solved: false,
      feedback: null,
      players: players.map((p) => (p.id === player.id ? { ...p, rolls: p.rolls + 1 } : p)),
    })
    speak(questionText(q))
  },

  answer: (value) => {
    const { phase, question, players, currentIdx, solved } = get()
    if (solved || !question) return
    if (phase !== 'ask-move' && phase !== 'ask-reward') return
    if (get().wrongPicks.includes(value)) return
    const player = players[currentIdx]

    if (value === question.answer) {
      playSound('correct')
      // vibración amable (si el dispositivo la soporta)
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.(60)
        }
      } catch {
        /* sin problema */
      }
      const pts = phase === 'ask-move' ? 50 : 0
      set({
        solved: true,
        feedback: { kind: 'correct', text: praise() },
        wrongPicks: [],
        players: players.map((p) =>
          p.id === player.id
            ? { ...p, attempts: p.attempts + 1, correct: p.correct + 1, points: p.points + pts }
            : p
        ),
      })
    } else {
      playSound('casi')
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.(150)
        }
      } catch {
        /* sin problema */
      }
      set({
        feedback: { kind: 'casi', text: nearly() },
        wrongPicks: [...get().wrongPicks, value],
        players: players.map((p) =>
          p.id === player.id ? { ...p, attempts: p.attempts + 1 } : p
        ),
      })
    }
  },

  proceedAfterCorrect: () => {
    const { phase, solved, dice, players, currentIdx, board, presetKey, question } = get()
    if (!solved || !board || dice === null || !question) return
    const player = players[currentIdx]

    if (phase === 'ask-move') {
      // avanzar casilla por casilla (capped en la meta)
      const target = Math.min(player.position + dice, board.totalTiles)
      const path: number[] = []
      for (let i = player.position + 1; i <= target; i++) path.push(i)
      if (path.length === 0) path.push(target)
      set({
        question: null,
        solved: false,
        feedback: null,
        anim: { playerId: player.id, path },
        phase: 'moving',
      })
      return
    }

    if (phase === 'ask-reward') {
      const tile = board.tiles[player.position - 1]
      const isMedal = tile?.kind === 'reward10'
      const pts = isMedal ? 250 : 100
      playSound('reward')
      set({
        question: null,
        solved: false,
        feedback: null,
        phase: 'celebrate',
        players: players.map((p) =>
          p.id === player.id
            ? {
                ...p,
                stars: !isMedal ? p.stars + 1 : p.stars,
                medals: isMedal ? p.medals + 1 : p.medals,
                points: p.points + pts,
              }
            : p
        ),
        celebration: { kind: isMedal ? 'medal' : 'star', points: pts },
      })
    }
  },

  moveDone: () => {
    const { phase, anim, board, players, currentIdx, presetKey, operations } = get()
    if (phase !== 'moving' || !anim || !board) return
    const target = anim.path[anim.path.length - 1]
    const player = players[currentIdx]
    const landedTile = board.tiles[target - 1]

    const withPosition = players.map((p) =>
      p.id === player.id ? { ...p, position: target } : p
    )

    if (target >= board.totalTiles || landedTile?.kind === 'meta') {
      // ¡llegó a la meta!
      const order = get().arrivalCounter + 1
      playSound('arrive')
      const name = player.name
      speak(`¡${name} llegó a la meta!`)
      set({
        players: withPosition.map((p) =>
          p.id === player.id ? { ...p, arrived: true, arrivalOrder: order } : p
        ),
        anim: null,
        arrival: { playerId: player.id, order },
        arrivalCounter: order,
        phase: 'arrived',
      })
      return
    }

    if (landedTile?.kind === 'reward5' || landedTile?.kind === 'reward10') {
      const q = genPracticeQuestion(presetKey, operations)
      set({
        players: withPosition,
        anim: null,
        question: q,
        phase: 'ask-reward',
        wrongPicks: [],
        solved: false,
        feedback: null,
      })
      speak(questionText(q))
      return
    }

    if (landedTile?.kind === 'bonus') {
      const c = randomCollectible(player.objects)
      playSound('object')
      set({
        players: withPosition.map((p) =>
          p.id === player.id
            ? { ...p, objects: [...p.objects, c.id], points: p.points + 300 }
            : p
        ),
        anim: null,
        celebration: { kind: 'object', points: 300, collectible: c },
        phase: 'celebrate',
      })
      speak(`¡Encontraste ${c.name}!`)
      return
    }

    // casilla normal → siguiente jugador
    set({ players: withPosition, anim: null })
    get().nextTurn()
  },

  dismissCelebration: () => {
    if (get().phase !== 'celebrate') return
    set({ celebration: null })
    get().nextTurn()
  },

  dismissArrival: () => {
    const { phase, players } = get()
    if (phase !== 'arrived') return
    set({ arrival: null })
    if (players.every((p) => p.arrived)) {
      get().finishGame()
    } else {
      get().nextTurn()
    }
  },

  playAgain: () => {
    get().startGame()
  },

  exitGame: () => {
    set({
      screen: 'home',
      board: null,
      players: [],
      phase: 'idle',
      dice: null,
      question: null,
      anim: null,
      celebration: null,
      arrival: null,
    })
  },

  toggleSound: () => {
    const next = !get().soundOn
    setSoundEnabled(next)
    set({ soundOn: next })
    if (next) playSound('click')
  },

  nextTurn: () => {
    const { players, currentIdx } = get()
    if (players.length === 0) return
    let idx = currentIdx
    for (let i = 1; i <= players.length; i++) {
      const candidate = (currentIdx + i) % players.length
      if (!players[candidate].arrived) {
        idx = candidate
        break
      }
    }
    set({
      currentIdx: idx,
      phase: 'idle',
      dice: null,
      question: null,
      wrongPicks: [],
      solved: false,
      feedback: null,
    })
  },

  finishGame: () => {
    playSound('finish')
    set({ phase: 'finished', saveState: 'saving' })
    const { board, players, presetKey, operations } = get()
    const sorted = [...players].sort((a, b) => (a.arrivalOrder ?? 99) - (b.arrivalOrder ?? 99))
    const winner = sorted[0]
    fetch('/api/partidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presetKey,
        operations,
        boardTiles: board?.totalTiles ?? 0,
        winnerName: winner?.name ?? '',
        winnerAnimalId: winner?.animalId ?? 'carpincho',
        players: players.map((p) => ({
          name: p.name,
          animalId: p.animalId,
          points: p.points,
          correct: p.correct,
          attempts: p.attempts,
          rolls: p.rolls,
          objects: p.objects.length,
          arrivalOrder: p.arrivalOrder,
        })),
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('fallo el guardado')
        set({ saveState: 'saved' })
      })
      .catch(() => set({ saveState: 'error' }))
  },
}))

// inicia el estado del sonido desde localStorage (seguro en SSR:
// se llama la primera vez que el store se usa en el cliente)
if (typeof window !== 'undefined') {
  const enabled = isSoundEnabled()
  useGameStore.setState({ soundOn: enabled })
}
