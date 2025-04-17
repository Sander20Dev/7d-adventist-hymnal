import { waitForKey } from '@/app/lib/hymn/player/keys'
import { IconPlayerTrackNext } from '@tabler/icons-react'
import { useEffect } from 'react'
import { Button } from './button'

interface NextBtnProps {
  goNext: () => void
  keysBlocked: boolean
  activeFocus: () => void
}

export default function NextBtn({
  goNext,
  keysBlocked,
  activeFocus,
}: NextBtnProps) {
  useEffect(() => {
    if (keysBlocked) return

    const tooglePlayKey = waitForKey({ key: 'ArrowRight' }, () => {
      goNext()
    })

    const tooglePlayWithKey = (ev: KeyboardEvent) => {
      tooglePlayKey(ev)
    }
    window.addEventListener('keydown', tooglePlayWithKey)
    return () => {
      window.removeEventListener('keydown', tooglePlayWithKey)
    }
  }, [keysBlocked, goNext])

  const handleNext = () => {
    activeFocus()
    goNext()
  }

  return (
    <Button label='Siguiente' onClick={handleNext}>
      <IconPlayerTrackNext />
    </Button>
  )
}
