import { waitForKey } from '@/app/lib/hymn/player/keys'
import { getVolumeStorage, setVolumeStorage } from '@/app/lib/storage/volume'
import { useEffect, useState } from 'react'

interface VolumeRngProps {
  audio: HTMLAudioElement
  keysBlocked: boolean
  activeFocus: () => void
}

export default function VolumeRng({
  audio,
  keysBlocked,
  activeFocus,
}: VolumeRngProps) {
  const [volume, setVolume] = useState(100)

  useEffect(() => {
    audio.volume = getVolumeStorage() / 100

    const updateVolume = () => {
      setVolume(audio.volume * 100)
      setVolumeStorage(audio.volume * 100)
    }
    audio.addEventListener('volumechange', updateVolume)
    return () => {
      audio.removeEventListener('volumechange', updateVolume)
    }
  }, [])

  useEffect(() => {
    if (keysBlocked) return

    const turnUpVolumeKey = waitForKey(
      { key: 'ArrowUp' },
      () => (audio.volume = Math.min(audio.volume + 0.1, 1) / 1)
    )
    const turnDownVolumeKey = waitForKey(
      { key: 'ArrowDown' },
      () => (audio.volume = Math.max(audio.volume - 0.1, 0) / 1)
    )

    const chageVolumeWithKey = (ev: KeyboardEvent) => {
      turnUpVolumeKey(ev)
      turnDownVolumeKey(ev)
    }
    window.addEventListener('keydown', chageVolumeWithKey)
    return () => {
      window.removeEventListener('keydown', chageVolumeWithKey)
    }
  }, [audio, keysBlocked])

  const handleVolume = (ev: React.ChangeEvent<HTMLInputElement>) => {
    activeFocus()
    const num = +ev.target.value
    audio.volume = num / 100
  }

  return (
    <input
      type='range'
      step={1}
      min={0}
      max={100}
      onChange={handleVolume}
      value={volume}
      className='w-full max-w-32'
    />
  )
}
