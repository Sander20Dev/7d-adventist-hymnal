import { waitForKey } from '@/app/lib/hymn/player/keys'
import { useEffect, useState } from 'react'

interface TimeRngProps {
  audio: HTMLAudioElement
  keysBlocked: boolean
  activeFocus: () => void
}

const numbers = Array.from({ length: 10 }, (_, i) => i.toString())

export default function TimeRng({
  audio,
  keysBlocked,
  activeFocus,
}: TimeRngProps) {
  const [time, setTime] = useState(audio.currentTime ?? 0)

  useEffect(() => {
    const updateTime = () => {
      if (Math.floor(audio.currentTime) === time) return

      setTime(Math.floor(audio.currentTime))
    }
    audio.addEventListener('timeupdate', updateTime)
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
    }
  }, [time])

  useEffect(() => {
    if (keysBlocked) return

    const changeTimeKey = waitForKey({ key: numbers }, (ev) => {
      const num = +ev.key
      audio.currentTime = audio.duration * num * 0.1
      activeFocus()
    })

    const moveForward10sKey = waitForKey(
      { key: 'ArrowRight', shift: true },
      () => {
        audio.currentTime = Math.min(audio.currentTime + 10, audio.duration)
        activeFocus()
      }
    )
    const moveBackward10sKey = waitForKey(
      { key: 'ArrowLeft', shift: true },
      () => {
        audio.currentTime = Math.max(audio.currentTime - 10, 0)
        activeFocus()
      }
    )

    const changeTimwWithKey = (ev: KeyboardEvent) => {
      changeTimeKey(ev)
      moveForward10sKey(ev)
      moveBackward10sKey(ev)
    }

    window.addEventListener('keydown', changeTimwWithKey)

    return () => {
      window.removeEventListener('keydown', changeTimwWithKey)
    }
  }, [keysBlocked])

  return (
    <input
      type='range'
      step={1}
      min={0}
      max={window.isNaN(audio.duration) ? 0 : audio.duration}
      value={time}
      onChange={(ev) => {
        activeFocus()
        audio.currentTime = +ev.target.value
      }}
      className='w-full'
    />
  )
}
