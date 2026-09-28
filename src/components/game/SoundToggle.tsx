'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useGameStore } from '@/lib/game/store'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function SoundToggle() {
  const soundOn = useGameStore((s) => s.soundOn)
  const toggleSound = useGameStore((s) => s.toggleSound)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            aria-label={soundOn ? 'APAGAR SONIDO' : 'PRENDER SONIDO'}
            className="h-11 w-11 rounded-full border-2 border-stone-300 bg-white text-stone-700 hover:bg-amber-50"
          >
            {soundOn ? (
              <Volume2 className="h-5 w-5" aria-hidden />
            ) : (
              <VolumeX className="h-5 w-5" aria-hidden />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span className="font-bold">{soundOn ? 'SONIDO: ON' : 'SONIDO: OFF'}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
