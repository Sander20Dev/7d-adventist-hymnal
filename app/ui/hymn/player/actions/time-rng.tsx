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
  const [time, setTime] = useState(audio?.currentTime ?? 0)

  useEffect(() => {
    if (audio == null) return
    const updateTime = () => {
      setTime(audio.currentTime)
      activeFocus()
    }
    audio.addEventListener('timeupdate', updateTime)
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
    }
  }, [audio])

  useEffect(() => {
    if (keysBlocked) return
    if (audio == null) return

    const changeTimeKey = waitForKey({ key: numbers }, (ev) => {
      if (audio == null) return
      const num = +ev.key
      audio.currentTime = audio.duration * num * 0.1
    })

    const moveForward10sKey = waitForKey(
      { key: 'ArrowRight', shift: true },
      () => {
        if (audio == null) return
        audio.currentTime = Math.min(audio.currentTime + 10, audio.duration)
      }
    )
    const moveBackward10sKey = waitForKey(
      { key: 'ArrowLeft', shift: true },
      () => {
        if (audio == null) return
        audio.currentTime = Math.max(audio.currentTime - 10, 0)
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
  }, [audio, keysBlocked])

  return (
    <input
      type='range'
      step={1}
      min={0}
      max={window.isNaN(audio.duration) ? 0 : audio.duration}
      value={time}
      onChange={(ev) => (audio.currentTime = +ev.target.value)}
      className='w-full'
    />
  )
}
