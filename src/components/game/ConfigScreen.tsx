'use client'

// ============================================================
// Senda Nativa — Configuración de la partida
// 1) cantidad de jugadores · 2) personaje + nombre ·
// 3) nivel (rango de números) · 4) operaciones
// ============================================================

import { useState } from 'react'
import { ArrowLeft, Minus, Plus, Dices } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { ANIMALS, getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import { CENTENA_PRESET_LIST, isCentenaBoardKey, PRESET_LIST } from '@/lib/game/presets'
import type { CentenaStart, OperationMode, PresetKey } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SoundToggle } from './SoundToggle'

const OP_OPTIONS: { key: OperationMode; label: string }[] = [
  { key: 'sumas', label: 'SOLO SUMAS' },
  { key: 'restas', label: 'SOLO RESTAS' },
  { key: 'mixto', label: 'SUMAS Y RESTAS' },
]

function PlayerRow({ index }: { index: number }) {
  const setup = useGameStore((s) => s.setups[index])
  const setups = useGameStore((s) => s.setups)
  const setPlayerAnimal = useGameStore((s) => s.setPlayerAnimal)
  const setPlayerName = useGameStore((s) => s.setPlayerName)

  const others = setups
    .filter((_, i) => i !== index)
    .map((p) => p.animalId)

  if (!setup) return null
  const animal = getAnimal(setup.animalId)

  return (
    <li className="rounded-3xl border-2 border-stone-200 bg-white p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow-sm sm:h-16 sm:w-16"
          style={{ borderColor: animal.color }}
        >
          <AnimalArt id={setup.animalId} mood="happy" className="h-13 w-13 sm:h-15 sm:w-15" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-stone-400">JUGADOR/A {index + 1}</p>
          <Input
            value={setup.name}
            onChange={(e) => setPlayerName(index, e.target.value)}
            placeholder={`NOMBRE (O DEJALO VACÍO PARA SER ${animal.name})`}
            maxLength={16}
            className="h-12 rounded-2xl border-2 border-stone-200 bg-amber-50/50 text-lg font-extrabold text-stone-700 placeholder:text-sm placeholder:font-bold placeholder:text-stone-400 focus-visible:ring-amber-300"
            aria-label={`NOMBRE DEL JUGADOR O JUGADORA ${index + 1}`}
          />
        </div>
      </div>
      <div
        className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2"
        role="group"
        aria-label={`PERSONAJE DEL JUGADOR/A ${index + 1}`}
      >
        {ANIMALS.map((a) => {
          const taken = others.includes(a.id)
          const selected = setup.animalId === a.id
          return (
            <button
              key={a.id}
              type="button"
              disabled={taken && !selected}
              onClick={() => setPlayerAnimal(index, a.id)}
              aria-label={taken && !selected ? `${a.name} (YA ELEGIDO)` : `ELEGIR ${a.name}`}
              aria-pressed={selected}
              className={`flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 transition-all ${
                selected
                  ? 'scale-105 border-amber-500 bg-amber-100 shadow-md'
                  : taken
                    ? 'cursor-not-allowed border-stone-100 bg-stone-100 opacity-40'
                    : 'border-stone-200 bg-white hover:-translate-y-0.5 hover:border-stone-300 hover:shadow'
              }`}
              style={selected ? { borderColor: animal.color } : undefined}
            >
              <AnimalArt id={a.id} mood={selected ? 'happy' : 'normal'} className="h-12 w-12 sm:h-14 sm:w-14" />
            </button>
          )
        })}
      </div>
    </li>
  )
}

export function ConfigScreen() {
  const playerCount = useGameStore((s) => s.playerCount)
  const setPlayerCount = useGameStore((s) => s.setPlayerCount)
  const presetKey = useGameStore((s) => s.presetKey)
  const setPreset = useGameStore((s) => s.setPreset)
  const operations = useGameStore((s) => s.operations)
  const setOperations = useGameStore((s) => s.setOperations)
  const goScreen = useGameStore((s) => s.goScreen)
  const startGame = useGameStore((s) => s.startGame)
  const [centenaStart, setCentenaStart] = useState<CentenaStart>(0)
  const centenaSelected = isCentenaBoardKey(presetKey)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => goScreen('home')}
          className="h-11 rounded-full border-2 border-stone-300 bg-white px-4 font-extrabold text-stone-700 hover:bg-stone-50"
        >
          <ArrowLeft className="mr-1 h-5 w-5" aria-hidden /> INICIO
        </Button>
        <h1 className="text-2xl font-extrabold text-stone-700 sm:text-3xl">
          ¡A PREPARAR LA PARTIDA!
        </h1>
        <SoundToggle />
      </div>

      {/* cantidad de jugadores */}
      <section
        className="flex flex-col items-center gap-3 rounded-3xl border-2 border-stone-200 bg-white p-4"
        aria-label="CANTIDAD DE JUGADORES"
      >
        <h2 className="text-xl font-extrabold text-stone-700">¿CUÁNTOS JUGAN?</h2>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setPlayerCount(playerCount - 1)}
            disabled={playerCount <= 1}
            aria-label="UN JUGADOR MENOS"
            className="h-14 w-14 rounded-2xl border-2 border-stone-300 bg-white text-2xl font-extrabold text-stone-700 hover:bg-amber-50 disabled:opacity-40"
          >
            <Minus className="h-7 w-7" aria-hidden />
          </Button>
          <span
            className="w-16 text-center text-5xl leading-none font-extrabold text-green-700"
            aria-live="polite"
          >
            {playerCount}
          </span>
          <Button
            onClick={() => setPlayerCount(playerCount + 1)}
            disabled={playerCount >= 8}
            aria-label="UN JUGADOR MÁS"
            className="h-14 w-14 rounded-2xl border-2 border-stone-300 bg-white text-2xl font-extrabold text-stone-700 hover:bg-amber-50 disabled:opacity-40"
          >
            <Plus className="h-7 w-7" aria-hidden />
          </Button>
        </div>
        <p className="text-sm font-bold text-stone-500">
          DE 1 A 8 JUGADORES, CADA UNO CON SU ANIMAL
        </p>
      </section>

      {/* jugadores */}
      <section aria-label="JUGADORES" className="flex flex-col gap-3">
        <h2 className="text-center text-xl font-extrabold text-stone-700">
          ELEGÍ PERSONAJE Y NOMBRE
        </h2>
        <ul className="flex flex-col gap-3">
          {Array.from({ length: playerCount }).map((_, i) => (
            <PlayerRow key={i} index={i} />
          ))}
        </ul>
      </section>

      {/* nivel + tablero de centenas */}
      <section aria-label="NIVEL Y RANGO DE NÚMEROS">
        <h2 className="mb-3 text-center text-xl font-extrabold text-stone-700">
          ¿CON QUÉ NÚMEROS JUGAMOS?
        </h2>
        <div className="flex flex-col gap-3" role="radiogroup" aria-label="NIVEL">
          <div className="grid gap-3 sm:grid-cols-3">
            {PRESET_LIST.map((p) => {
              const selected = presetKey === p.key
              return (
                <button
                  key={p.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPreset(p.key)}
                  className={`flex flex-col items-center gap-1 rounded-3xl border-3 p-4 text-center transition-all ${
                    selected
                      ? 'scale-[1.02] border-green-500 bg-green-50 shadow-lg'
                      : 'border-stone-200 bg-white hover:-translate-y-0.5 hover:border-stone-300 hover:shadow'
                  }`}
                >
                  <span className="text-3xl" aria-hidden>
                    {p.emoji}
                  </span>
                  <span className="text-lg leading-tight font-extrabold text-stone-800">
                    {p.name}
                  </span>
                  <span className="text-sm font-bold text-stone-500">{p.description}</span>
                  <span className="mt-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-extrabold text-stone-600">
                    {p.totalTiles} CASILLAS · DADO 1-{p.diceMax}
                    {p.diceUnit === 100 ? ' (×100)' : ''}
                  </span>
                </button>
              )
            })}
          </div>

          {/* tablero de centenas: el tablero completo de 100 casillas */}
          <div
            className={`flex flex-col items-center gap-3 rounded-3xl border-3 p-4 text-center transition-all sm:flex-row sm:gap-4 sm:text-left ${
              centenaSelected
                ? 'scale-[1.01] border-green-500 bg-green-50 shadow-lg'
                : 'border-stone-200 bg-white hover:-translate-y-0.5 hover:border-stone-300 hover:shadow'
            }`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={centenaSelected}
              onClick={() => setPreset(`centena_${centenaStart}`)}
              className="flex w-full flex-col items-center gap-1 sm:w-56 sm:shrink-0"
            >
              <span className="text-3xl" aria-hidden>
                🗺️
              </span>
              <span className="text-lg leading-tight font-extrabold text-stone-800">
                TABLERO DE CENTENAS
              </span>
              <span className="text-sm font-bold text-stone-500">
                EL TABLERO COMPLETO DE 100 CASILLAS
              </span>
            </button>
            <div className="flex w-full flex-1 flex-col items-center gap-2">
              <Select
                value={centenaSelected ? presetKey : ''}
                onValueChange={(v) => {
                  const start = Number(v.replace('centena_', '')) as CentenaStart
                  setCentenaStart(start)
                  setPreset(v as PresetKey)
                }}
              >
                <SelectTrigger
                  aria-label="CENTENA DEL TABLERO"
                  className="h-13 w-full max-w-xs rounded-2xl border-2 border-stone-300 bg-white text-lg font-extrabold text-stone-800 focus-visible:ring-amber-300"
                >
                  <SelectValue placeholder="ELEGÍ LA CENTENA (0 A 900)" />
                </SelectTrigger>
                <SelectContent className="max-h-72 rounded-2xl">
                  {CENTENA_PRESET_LIST.map((p) => (
                    <SelectItem
                      key={p.key}
                      value={p.key}
                      className="text-base font-extrabold"
                    >
                      {p.startNumber} · DE {p.startNumber + 1} A {p.startNumber + 100}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-extrabold text-stone-600">
                100 CASILLAS · DADO 1-6
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* operaciones */}
      <section aria-label="OPERACIONES">
        <h2 className="mb-3 text-center text-xl font-extrabold text-stone-700">
          ¿QUÉ CUENTAS PRACTICAMOS?
        </h2>
        <div
          className="mx-auto grid max-w-xl grid-cols-3 gap-2"
          role="group"
          aria-label="TIPO DE CUENTAS"
        >
          {OP_OPTIONS.map((o) => {
            const selected = operations === o.key
            return (
              <button
                key={o.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setOperations(o.key)}
                className={`min-h-12 rounded-2xl border-b-4 px-2 py-2.5 text-sm font-extrabold transition-all sm:text-base ${
                  selected
                    ? 'border-amber-600 bg-amber-400 text-white shadow-md'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-amber-50'
                }`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-center text-sm font-bold text-stone-500">
          SE USAN PARA AVANZAR, EN LAS ESTRELLAS ⭐ Y EN LAS MEDALLAS 🏅
        </p>
      </section>

      {/* empezar */}
      <div className="sticky bottom-4 z-10 mt-1 pb-1">
        <Button
          onClick={startGame}
          className="min-h-16 w-full rounded-3xl border-b-8 border-green-700 bg-green-500 py-4 text-2xl font-extrabold text-white shadow-xl transition-transform hover:-translate-y-0.5 hover:bg-green-400 active:translate-y-0.5 sm:text-3xl"
        >
          <Dices className="mr-2 h-7 w-7" aria-hidden /> ¡EMPEZAR!
        </Button>
      </div>
    </div>
  )
}
