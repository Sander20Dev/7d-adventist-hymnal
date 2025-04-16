import { IconPlayerTrackPrev } from '@tabler/icons-react'
import { Button } from './button'
import { waitForKey } from '@/app/lib/hymn/player/keys'
import { useEffect } from 'react'

interface PrevBtnProps {
  goPrev: () => void
  keysBlocked: boolean
  activeFocus: () => void
}

export default function PrevBtn({
  goPrev,
  keysBlocked,
  activeFocus,
}: PrevBtnProps) {
  useEffect(() => {
    if (keysBlocked) return

    const tooglePlayKey = waitForKey({ key: 'ArrowLeft' }, () => {
      goPrev()
    })

    const tooglePlayWithKey = (ev: KeyboardEvent) => {
      tooglePlayKey(ev)
    }
    window.addEventListener('keydown', tooglePlayWithKey)
    return () => {
      window.removeEventListener('keydown', tooglePlayWithKey)
    }
  }, [keysBlocked])

  const handlePrev = () => {
    activeFocus()
    goPrev()
  }

  return (
    <Button label='Anterior' onClick={handlePrev}>
      <IconPlayerTrackPrev />
    </Button>
  )
}
