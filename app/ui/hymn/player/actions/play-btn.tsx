import { useEffect, useState } from 'react'
import { Button } from './button'
import { waitForKey } from '@/app/lib/hymn/player/keys'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'

interface PlayBtnProps {
  audio: HTMLAudioElement
  keysBlocked: boolean
  activeFocus: () => void
}

export default function PlayBtn({
  audio,
  keysBlocked,
  activeFocus,
}: PlayBtnProps) {
  const [played, setPlayed] = useState(!(audio.paused ?? true))

  useEffect(() => {
    const updatePlayed = () => {
      setPlayed(!audio.paused)
      activeFocus()
    }
    audio.addEventListener('play', updatePlayed)
    audio.addEventListener('pause', updatePlayed)
    return () => {
      audio.removeEventListener('play', updatePlayed)
      audio.removeEventListener('pause', updatePlayed)
    }
  }, [])

  useEffect(() => {
    if (keysBlocked) return

    const tooglePlayKey = waitForKey({ key: ' ' }, () => {
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
    })

    const tooglePlayWithKey = (ev: KeyboardEvent) => {
      tooglePlayKey(ev)
    }
    window.addEventListener('keydown', tooglePlayWithKey)
    return () => {
      window.removeEventListener('keydown', tooglePlayWithKey)
    }
  }, [keysBlocked])

  const handlePlay = () => {
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  return (
    <Button label={!played ? 'Reproducir' : 'Pausar'} onClick={handlePlay}>
      {!played ? <IconPlayerPlay /> : <IconPlayerPause />}
    </Button>
  )
}
