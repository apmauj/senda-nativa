// ============================================================
// Senda Nativa — Sonidos sintetizados (Web Audio) + voz (TTS)
// ============================================================
// Módulo SOLO CLIENTE (con guards SSR). Sin archivos de audio:
// todo se sintetiza con Web Audio API. La voz usa speechSynthesis.
//  · AudioContext LAZY: se crea en el primer play (política de
//    autoplay de los navegadores) y se REUTILIZA (una sola instancia
//    por módulo → sin memory leaks). resume() si queda suspendido.
//  · Toggle ON/OFF persistido en localStorage 'senda-nativa-sonido'.
//  · Volumen master suave (~0.2), pensado para chicos: nada estridente.

export type SoundName =
  | 'dice'
  | 'hop'
  | 'correct'
  | 'casi'
  | 'reward'
  | 'object'
  | 'arrive'
  | 'finish'
  | 'click'

const MASTER_VOLUME = 0.2
const STORAGE_KEY = 'senda-nativa-sonido'

// Único AudioContext del módulo (lazy, reutilizado).
let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null

// ------------------------------------------------------------
// Toggle de sonido (localStorage, default ON)
// ------------------------------------------------------------

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSoundEnabled(v: boolean): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, v ? 'on' : 'off')
  } catch {
    // localStorage bloqueado (modo privado) → ignorar silenciosamente
  }
}

// ------------------------------------------------------------
// Motor Web Audio (lazy)
// ------------------------------------------------------------

function getAudio(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === 'undefined') return null
  try {
    if (audioCtx === null || masterGain === null) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!AC) return null
      audioCtx = new AC()
      masterGain = audioCtx.createGain()
      masterGain.gain.value = MASTER_VOLUME
      masterGain.connect(audioCtx.destination)
    }
    // Política de autoplay: puede quedar suspendido hasta un gesto.
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return { ctx: audioCtx, out: masterGain }
  } catch {
    return null
  }
}

interface ToneOptions {
  type?: OscillatorType
  /** frecuencia inicial (Hz) */
  from: number
  /** frecuencia final (Hz) → si se pasa, hace glissando */
  to?: number
  /** seg de demora desde ahora */
  at?: number
  /** duración total en seg */
  dur: number
  /** pico relativo (0..1) */
  gain?: number
  attack?: number
  release?: number
}

/** Nota con envolvente attack–hold–release (sin "cortes" feos). */
function tone(ctx: AudioContext, out: GainNode, o: ToneOptions): void {
  const t0 = ctx.currentTime + (o.at ?? 0)
  const dur = Math.max(0.02, o.dur)
  const attack = Math.min(o.attack ?? 0.01, dur * 0.5)
  const release = Math.min(o.release ?? 0.05, dur * 0.6)
  const peak = Math.max(0.001, o.gain ?? 0.8)

  const osc = ctx.createOscillator()
  osc.type = o.type ?? 'sine'
  osc.frequency.setValueAtTime(Math.max(1, o.from), t0)
  if (o.to !== undefined && o.to !== o.from) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.to), t0 + dur)
  }

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack)
  g.gain.setValueAtTime(peak, t0 + Math.max(attack, dur - release))
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  osc.connect(g)
  g.connect(out)
  osc.start(t0)
  osc.stop(t0 + dur + 0.03)
}

/** Golpecito de ruido blanco filtrado (bandpass), para el dado. */
function noiseBurst(
  ctx: AudioContext,
  out: GainNode,
  at: number,
  dur: number,
  freq: number,
  gain = 0.9
): void {
  const t0 = ctx.currentTime + at
  const length = Math.max(1, Math.floor(ctx.sampleRate * dur))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1

  const src = ctx.createBufferSource()
  src.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  filter.Q.value = 1.4

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  src.connect(filter)
  filter.connect(g)
  g.connect(out)
  src.start(t0)
  src.stop(t0 + dur + 0.02)
}

// ------------------------------------------------------------
// Diseño de cada sonido (suaves y alegres, para chicos)
// ------------------------------------------------------------

const C5 = 523.25
const E5 = 659.25
const G5 = 783.99
const C6 = 1046.5
const E6 = 1318.51
const G4 = 392.0

function playDice(ctx: AudioContext, out: GainNode): void {
  // 3-4 golpecitos de "rattle": ruido corto por bandpass 800-2000Hz
  const knocks = Math.random() < 0.5 ? 3 : 4
  for (let i = 0; i < knocks; i++) {
    noiseBurst(ctx, out, i * 0.07, 0.04, 800 + Math.random() * 1200, 0.9)
  }
}

function playHop(ctx: AudioContext, out: GainNode): void {
  // blip corto tipo "pop" al saltar cada casilla
  tone(ctx, out, { type: 'triangle', from: 300, to: 500, dur: 0.07, gain: 0.7 })
}

function playCorrect(ctx: AudioContext, out: GainNode): void {
  // dos notas alegres: C5 → G5
  tone(ctx, out, { from: C5, at: 0, dur: 0.11, gain: 0.8, release: 0.04 })
  tone(ctx, out, { from: G5, at: 0.11, dur: 0.12, gain: 0.8, release: 0.05 })
}

function playCasi(ctx: AudioContext, out: GainNode): void {
  // "casi" AMABLE: bajadita suave, volumen bajo, nunca estridente
  tone(ctx, out, {
    type: 'triangle',
    from: 330,
    to: 262,
    at: 0,
    dur: 0.2,
    gain: 0.4,
    attack: 0.03,
    release: 0.1,
  })
}

function playReward(ctx: AudioContext, out: GainNode): void {
  // arpegio rápido ascendente tipo campanita: C5 E5 G5 C6
  const notes = [C5, E5, G5, C6]
  notes.forEach((f, i) => {
    tone(ctx, out, { from: f, at: i * 0.09, dur: 0.15, gain: 0.7, release: 0.07 })
    // parcial de octava muy suave → timbre a campanita
    tone(ctx, out, { from: f * 2, at: i * 0.09, dur: 0.08, gain: 0.15, release: 0.04 })
  })
}

function playObject(ctx: AudioContext, out: GainNode): void {
  // brillo mágico: glissando 600→1400 + campanitas
  tone(ctx, out, {
    type: 'triangle',
    from: 600,
    to: 1400,
    dur: 0.4,
    gain: 0.45,
    attack: 0.05,
    release: 0.15,
  })
  tone(ctx, out, { from: 1200, at: 0.18, dur: 0.09, gain: 0.3, release: 0.05 })
  tone(ctx, out, { from: 1600, at: 0.28, dur: 0.09, gain: 0.25, release: 0.05 })
}

function playArrive(ctx: AudioContext, out: GainNode): void {
  // fanfarria corta: C5-E5-G5-C6 + acorde final
  const notes = [C5, E5, G5, C6]
  notes.forEach((f, i) => {
    tone(ctx, out, { from: f, at: i * 0.09, dur: 0.12, gain: 0.75, release: 0.05 })
  })
  notes.forEach((f) => {
    tone(ctx, out, { from: f, at: 0.38, dur: 0.4, gain: 0.5, attack: 0.02, release: 0.2 })
  })
}

function playFinish(ctx: AudioContext, out: GainNode): void {
  // fanfarria más larga y alegre: G4-C5-E5-G5-C6 + acorde + brillo
  const seq = [G4, C5, E5, G5, C6]
  seq.forEach((f, i) => {
    tone(ctx, out, { from: f, at: i * 0.11, dur: 0.14, gain: 0.75, release: 0.06 })
  })
  ;[C5, E5, G5, C6].forEach((f) => {
    tone(ctx, out, { from: f, at: 0.6, dur: 0.55, gain: 0.5, attack: 0.02, release: 0.3 })
  })
  tone(ctx, out, { from: E6, at: 0.72, dur: 0.4, gain: 0.25, attack: 0.02, release: 0.25 })
}

function playClick(ctx: AudioContext, out: GainNode): void {
  // tick corto y bajito
  tone(ctx, out, { type: 'square', from: 220, dur: 0.035, gain: 0.2, release: 0.02 })
}

// ------------------------------------------------------------
// API pública
// ------------------------------------------------------------

/** Reproduce un sonido sintetizado (si el sonido está activado). */
export function playSound(name: SoundName): void {
  if (!isSoundEnabled()) return
  const audio = getAudio()
  if (!audio) return
  const { ctx, out } = audio
  try {
    switch (name) {
      case 'dice':
        playDice(ctx, out)
        break
      case 'hop':
        playHop(ctx, out)
        break
      case 'correct':
        playCorrect(ctx, out)
        break
      case 'casi':
        playCasi(ctx, out)
        break
      case 'reward':
        playReward(ctx, out)
        break
      case 'object':
        playObject(ctx, out)
        break
      case 'arrive':
        playArrive(ctx, out)
        break
      case 'finish':
        playFinish(ctx, out)
        break
      case 'click':
        playClick(ctx, out)
        break
    }
  } catch {
    // el sonido nunca debe romper el juego
  }
}

/** Lee un texto por voz (es-UY o la primera voz en español que haya). */
export function speak(text: string): void {
  if (typeof window === 'undefined') return
  if (!isSoundEnabled()) return
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.cancel() // corta la lectura anterior
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-UY'
    const voices = synth.getVoices()
    const voice =
      voices.find((v) => v.lang === 'es-UY') ??
      voices.find((v) => v.lang?.toLowerCase().startsWith('es')) ??
      null
    if (voice) utterance.voice = voice
    utterance.rate = 0.9
    utterance.pitch = 1.05
    synth.speak(utterance)
  } catch {
    // la voz nunca debe romper el juego
  }
}
