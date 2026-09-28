'use client'

// ============================================================
// Senda Nativa — Juego de tablero educativo con animales
// autóctonos de Uruguay (sumas y restas por rangos).
// ============================================================

import { useGameStore } from '@/lib/game/store'
import { HomeScreen } from '@/components/game/HomeScreen'
import { ConfigScreen } from '@/components/game/ConfigScreen'
import { GameScreen } from '@/components/game/GameScreen'

export default function Page() {
  const screen = useGameStore((s) => s.screen)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FDF9EC] via-[#FAF3DC] to-[#F2E9CB] uppercase">
      <main className="mx-auto w-full max-w-5xl flex-1 px-3 pt-4 pb-6 sm:px-5">
        {screen === 'home' ? <HomeScreen /> : null}
        {screen === 'config' ? <ConfigScreen /> : null}
        {screen === 'game' ? <GameScreen /> : null}
      </main>

      <footer className="mt-auto border-t-2 border-stone-200/70 bg-[#F7F0DB] py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-center">
        <p className="text-sm font-extrabold tracking-wide text-green-800">
          🌾 SENDA NATIVA · ANIMALES AUTÓCTONOS DEL URUGUAY 🌾
        </p>
        <p className="mt-0.5 text-xs font-bold text-stone-500">
          CARPINCHO · ZORRITO ROJO · GUAZUBIRÁ · MULITA · LOBITO DE RÍO · LECHUZA DE CAMPO ·
          YACARÉ · YAGUARETÉ
        </p>
      </footer>
    </div>
  )
}
