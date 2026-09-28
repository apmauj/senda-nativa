'use client'

// ============================================================
// Senda Nativa — Pantalla de inicio
// ============================================================

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Play,
  BookOpen,
  Dice5,
  CircleHelp,
  Trophy,
  Sparkles,
  QrCode,
  Copy,
  Check,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useGameStore } from '@/lib/game/store'
import { ANIMALS, getAnimal } from '@/lib/game/animals'
import { AnimalArt } from '@/components/animals'
import { PRESETS } from '@/lib/game/presets'
import { getLocalGameHistory } from '@/lib/game/history'
import type { StoredGameResult } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SoundToggle } from './SoundToggle'

function AnimalsGallery({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[85vh] max-w-3xl gap-4 overflow-y-auto rounded-3xl border-4 border-green-300 bg-green-50 p-5 sm:p-7">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl font-extrabold text-green-800 sm:text-3xl">
            🌿 FICHAS DE LOS ANIMALES 🌿
          </DialogTitle>
          <DialogDescription className="text-base font-bold text-stone-600">
            ANIMALES AUTÓCTONOS DEL URUGUAY: ¡CONOCÉ A TUS COMPAÑEROS DE JUEGO!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {ANIMALS.map((a) => (
            <article
              key={a.id}
              className="flex gap-3 rounded-2xl border-2 p-3"
              style={{ borderColor: a.color, background: a.colorSoft }}
              aria-label={a.name}
            >
              <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
                <AnimalArt id={a.id} mood="happy" className="h-18 w-18" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg leading-tight font-extrabold text-stone-800">{a.name}</h3>
                <p className="text-xs italic text-stone-500 normal-case">{a.scientificName}</p>
                <p className="text-sm font-bold text-stone-600">{a.nickname}</p>
                <p className="mt-1 text-sm font-bold text-stone-500">🏡 {a.habitat}</p>
                <p className="mt-1 text-sm text-stone-600 normal-case">{a.funFact}</p>
                <p className="mt-1 inline-block rounded-full bg-white/70 px-2 py-0.5 text-xs font-extrabold text-stone-600">
                  ESTADO: {a.conservation}
                </p>
              </div>
            </article>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ShareCard() {
  const [url, setUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // La URL se calcula SOLO en el cliente (SSR-safe, sin useSearchParams).
  // Se difiere un tick para no hacer setState sincrónico dentro del effect.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setUrl(window.location.origin + window.location.pathname)
      } catch {
        setUrl(null)
      }
    }, 0)
    return () => clearTimeout(t)
  }, [])

  // Vuelve al estado normal después de ~2 segundos.
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const handleCopy = async () => {
    if (!url) return
    let ok = false
    // 1) Intento con el portapapeles moderno (puede no existir en http).
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        ok = true
      }
    } catch {
      ok = false
    }
    // 2) Fallback con textarea oculto + execCommand (contextos no seguros).
    if (!ok) {
      try {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        ta.style.pointerEvents = 'none'
        document.body.appendChild(ta)
        ta.select()
        ta.setSelectionRange(0, ta.value.length)
        ok = document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {
        ok = false
      }
    }
    if (ok) setCopied(true)
  }

  return (
    <section
      className="mx-auto w-full max-w-2xl rounded-3xl border-2 border-stone-200 bg-white p-4 sm:p-5"
      aria-label="COMPARTIR EL JUEGO"
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
        {/* código QR */}
        {url ? (
          <span
            role="img"
            aria-label="CÓDIGO QR PARA ABRIR SENDA NATIVA"
            className="flex shrink-0 items-center justify-center rounded-2xl border-2 border-amber-200 bg-white p-2 shadow-sm"
          >
            <QRCodeSVG value={url} size={128} />
          </span>
        ) : (
          <div
            aria-hidden
            className="h-28 w-28 shrink-0 animate-pulse rounded-2xl bg-stone-100 sm:h-32 sm:w-32"
          />
        )}

        {/* texto + botón copiar */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-stone-700">
            <QrCode className="h-5 w-5 text-green-700" aria-hidden /> ¡COMPARTÍ EL JUEGO!
          </h2>
          <p className="text-center text-sm font-bold text-stone-500 sm:text-left">
            ESCANEÁ EL CÓDIGO CON LA CÁMARA DEL CELULAR PARA ABRIR EL JUEGO EN OTRO
            DISPOSITIVO
          </p>
          <Button
            onClick={handleCopy}
            disabled={!url}
            aria-live="polite"
            variant="outline"
            className="min-h-12 rounded-2xl border-2 border-stone-300 bg-white px-5 text-base font-extrabold text-stone-700 hover:bg-amber-50"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-600" aria-hidden /> ¡LINK COPIADO!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5 text-amber-500" aria-hidden /> COPIAR EL LINK
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}

function RecentGames() {
  const [partidas, setPartidas] = useState<StoredGameResult[] | null>(null)

  useEffect(() => {
    let cancelled = false
    setPartidas(getLocalGameHistory())

    fetch('/api/partidas')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('fallo'))))
      .then((data) => {
        if (!cancelled) setPartidas(data.partidas ?? [])
      })
      .catch(() => {
        if (!cancelled) setPartidas(getLocalGameHistory())
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      className="mx-auto w-full max-w-2xl rounded-3xl border-2 border-stone-200 bg-white p-4 sm:p-5"
      aria-label="ÚLTIMAS PARTIDAS"
    >
      <h2 className="flex items-center justify-center gap-2 text-xl font-extrabold text-stone-700">
        <Trophy className="h-5 w-5 text-amber-500" aria-hidden /> ÚLTIMAS PARTIDAS
      </h2>
      {partidas === null ? (
        <p className="mt-2 text-center text-base font-bold text-stone-400">CARGANDO…</p>
      ) : partidas.length === 0 ? (
        <p className="mt-2 text-center text-base font-bold text-stone-400">
          TODAVÍA NO HAY PARTIDAS GUARDADAS
        </p>
      ) : (
        <ul className="custom-scrollbar mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
          {partidas.map((g) => {
            const preset = PRESETS[g.presetKey as keyof typeof PRESETS]
            const animal = getAnimal(g.winnerAnimalId)
            return (
              <li
                key={g.id}
                className="flex items-center gap-3 rounded-2xl border-2 border-stone-100 bg-stone-50 px-3 py-2"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-white"
                  style={{ borderColor: animal.color }}
                >
                  <AnimalArt id={g.winnerAnimalId} mood="happy" className="h-9 w-9" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold text-stone-700">
                    🏆 GANÓ {g.winnerName}
                  </p>
                  <p className="truncate text-sm font-bold text-stone-500">
                    {preset ? preset.shortName : g.presetKey} ·{' '}
                    {g.operations === 'mixto'
                      ? 'MIXTAS'
                      : g.operations === 'sumas'
                        ? 'SUMAS'
                        : 'RESTAS'}{' '}
                    · {g.players.length}{' '}
                    {g.players.length === 1 ? 'JUGADOR' : 'JUGADORES'}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-stone-400">
                  HACE{' '}
                  {formatDistanceToNow(new Date(g.createdAt), {
                    addSuffix: false,
                    locale: es,
                  }).toUpperCase()}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export function HomeScreen() {
  const goScreen = useGameStore((s) => s.goScreen)
  const [galleryOpen, setGalleryOpen] = useState(false)

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
      <div className="flex w-full items-center justify-end">
        <SoundToggle />
      </div>

      {/* héroe */}
      <header className="relative flex flex-col items-center gap-2 text-center">
        <p className="text-5xl sm:text-6xl" aria-hidden>
          🌾
        </p>
        <h1 className="text-5xl leading-none font-extrabold tracking-tight text-green-800 drop-shadow-sm sm:text-7xl">
          SENDA
          <span className="text-amber-500"> NATIVA</span>
        </h1>
        <p className="max-w-xl text-lg font-bold text-stone-600 sm:text-xl">
          EL RECORRIDO DE LOS ANIMALES AUTÓCTONOS DEL URUGUAY
        </p>
        <p className="max-w-lg text-base font-bold text-stone-500">
          TIRÁ EL DADO, RESOLVÉ SUMAS Y RESTAS, GANÁ ESTRELLAS, MEDALLAS Y OBJETOS, ¡Y LLEGÁ A
          LA META!
        </p>

        {/* animalitos mirando */}
        <div className="mt-2 flex items-end justify-center gap-1 sm:gap-2" aria-hidden>
          {(['carpincho', 'zorrito', 'guazubira', 'mulita'] as const).map((id, i) => (
            <span
              key={id}
              className="floaty flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-md sm:h-20 sm:w-20"
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              <AnimalArt id={id} mood="normal" className="h-13 w-13 sm:h-18 sm:w-18" />
            </span>
          ))}
        </div>
        <div className="-mt-2 flex items-end justify-center gap-1 sm:gap-2" aria-hidden>
          {(['lobito', 'lechuza', 'yacare', 'yaguarete'] as const).map((id, i) => (
            <span
              key={id}
              className="floaty flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-md sm:h-20 sm:w-20"
              style={{ animationDelay: `${1.4 + i * 0.35}s` }}
            >
              <AnimalArt id={id} mood="normal" className="h-13 w-13 sm:h-18 sm:w-18" />
            </span>
          ))}
        </div>
      </header>

      {/* botones principales */}
      <div className="flex w-full max-w-md flex-col gap-3">
        <Button
          onClick={() => goScreen('config')}
          className="min-h-16 rounded-3xl border-b-8 border-green-700 bg-green-500 py-4 text-2xl font-extrabold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-green-400 active:translate-y-0.5 sm:text-3xl"
        >
          <Play className="mr-2 h-7 w-7" aria-hidden /> ¡A JUGAR!
        </Button>
        <Button
          onClick={() => setGalleryOpen(true)}
          variant="outline"
          className="min-h-14 rounded-3xl border-3 border-green-500 bg-white py-3 text-xl font-extrabold text-green-700 hover:bg-green-50"
        >
          <BookOpen className="mr-2 h-6 w-6" aria-hidden /> FICHAS DE LOS ANIMALES
        </Button>
      </div>

      {/* cómo se juega */}
      <section
        className="grid w-full max-w-3xl gap-3 sm:grid-cols-3"
        aria-label="CÓMO SE JUEGA"
      >
        {[
          {
            icon: <Dice5 className="h-8 w-8 text-amber-500" aria-hidden />,
            title: '1 · TIRÁ EL DADO',
            text: 'EN TU TURNO TOCÁ EL DADO Y MIRÁ CUÁNTO SACASTE',
          },
          {
            icon: <CircleHelp className="h-8 w-8 text-green-600" aria-hidden />,
            title: '2 · RESOLVÉ LA CUENTA',
            text: 'SUMÁ O RESTÁ SEGÚN LA PARTIDA, Y ELEGÍ LA OPCIÓN CORRECTA',
          },
          {
            icon: <Sparkles className="h-8 w-8 text-rose-400" aria-hidden />,
            title: '3 · GANÁ PREMIOS',
            text: 'ESTRELLAS, MEDALLAS Y OBJETOS SORPRESA EN EL CAMINO',
          },
        ].map((s) => (
          <div
            key={s.title}
            className="flex flex-col items-center gap-1 rounded-3xl border-2 border-stone-200 bg-white p-4 text-center"
          >
            {s.icon}
            <h3 className="text-lg font-extrabold text-stone-700">{s.title}</h3>
            <p className="text-sm font-bold text-stone-500">{s.text}</p>
          </div>
        ))}
      </section>

      {/* compartir el juego */}
      <ShareCard />

      <RecentGames />

      <AnimalsGallery open={galleryOpen} onOpenChange={setGalleryOpen} />
    </div>
  )
}
