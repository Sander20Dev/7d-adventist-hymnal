import { getMinTime } from '@/app/lib/hymn/time'
import { useEffect, useState } from 'react'

interface PosDurSpanProps {
  audio: HTMLAudioElement
}

export default function PosDurSpan({ audio }: PosDurSpanProps) {
  const [pos, setPos] = useState(audio.currentTime)

  useEffect(() => {
    const updatePos = () => {
      if (Math.floor(audio.currentTime) === pos) return

      setPos(Math.floor(audio.currentTime))
    }
    audio.addEventListener('timeupdate', updatePos)
    return () => {
      audio.removeEventListener('timeupdate', updatePos)
    }
  }, [pos])

  return (
    <span className='text-nowrap'>
      {getMinTime(pos)} /{' '}
      {getMinTime(isNaN(audio.duration ?? NaN) ? undefined : audio.duration)}
    </span>
  )
}
