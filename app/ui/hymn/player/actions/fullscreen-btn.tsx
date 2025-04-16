import { IconMaximize, IconMinimize } from '@tabler/icons-react'
import { Button } from './button'
import { useEffect, useState } from 'react'
import { waitForKey } from '@/app/lib/hymn/player/keys'

interface FullscreenBtnProps {
  keysBlocked: boolean
  activeFocus: () => void
}

export default function FullscreenBtn({
  keysBlocked,
  activeFocus,
}: FullscreenBtnProps) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (keysBlocked) return

    const toogleFullscreenKey = waitForKey({ key: 'f' }, handleFullscreen)

    const toogleFullscreenWithKey = (ev: KeyboardEvent) => {
      toogleFullscreenKey(ev)
    }
    window.addEventListener('keydown', toogleFullscreenWithKey)
    return () => {
      window.removeEventListener('keydown', toogleFullscreenWithKey)
    }
  }, [keysBlocked])

  useEffect(() => {
    const updateFullscreen = () => {
      setFullscreen(document.fullscreenElement != null)
    }
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreen)
    }
  }, [])

  const handleFullscreen = () => {
    activeFocus()
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  return (
    <Button
      onClick={handleFullscreen}
      className='ml-2'
      label='Pantalla completa'>
      {fullscreen ? <IconMinimize /> : <IconMaximize />}
    </Button>
  )
}
