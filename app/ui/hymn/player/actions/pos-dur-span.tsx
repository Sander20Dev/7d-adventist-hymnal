import { getMinTime } from '@/app/lib/hymn/time'
import { useEffect, useState } from 'react'

interface PosDurSpanProps {
  audio: HTMLAudioElement
}

export default function PosDurSpan({ audio }: PosDurSpanProps) {
  const [pos, setPos] = useState(audio.currentTime)

  useEffect(() => {
    if (audio == null) return
    const updatePos = () => {
      setPos(audio.currentTime)
    }
    audio.addEventListener('timeupdate', updatePos)
    return () => {
      audio.removeEventListener('timeupdate', updatePos)
    }
  }, [audio])

  return (
    <span className='text-nowrap'>
      {getMinTime(pos)} /{' '}
      {getMinTime(isNaN(audio.duration ?? NaN) ? undefined : audio.duration)}
    </span>
  )
}
