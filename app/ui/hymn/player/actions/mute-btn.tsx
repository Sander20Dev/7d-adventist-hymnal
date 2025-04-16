import { waitForKey } from '@/app/lib/hymn/player/keys'
import { getMutedStorage, setMutedStorage } from '@/app/lib/storage/muted'
import { useEffect, useState } from 'react'
import { Button } from './button'
import {
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconVolumeOff,
} from '@tabler/icons-react'

interface MuteBtnProps {
  audio: HTMLAudioElement
  keysBlocked: boolean
  activeFocus: () => void
}

export default function MuteBtn({
  audio,
  keysBlocked,
  activeFocus,
}: MuteBtnProps) {
  const [muted, setMuted] = useState(getMutedStorage)
  const [volume, setVolume] = useState(100)

  useEffect(() => {
    const updateVolume = () => {
      setVolume(audio.volume * 100)
    }
    audio.addEventListener('volumechange', updateVolume)
    return () => {
      audio.removeEventListener('volumechange', updateVolume)
    }
  }, [])

  useEffect(() => {
    audio.muted = muted
    setMutedStorage(muted)
    activeFocus()
  }, [audio, muted])

  useEffect(() => {
    if (keysBlocked) return

    setMuted(audio.muted)

    const toogleMuteKey = waitForKey({ key: 'm' }, () => setMuted(!muted))

    const toogleMuteWithKey = (ev: KeyboardEvent) => {
      toogleMuteKey(ev)
    }
    window.addEventListener('keydown', toogleMuteWithKey)
    return () => {
      window.removeEventListener('keydown', toogleMuteWithKey)
    }
  }, [audio, muted, keysBlocked])

  const handleMute = () => {
    activeFocus()
    setMuted(!muted)
  }

  return (
    <Button onClick={handleMute} label='Silenciar' className='ml-2'>
      {muted ? (
        <IconVolumeOff />
      ) : volume > 50 ? (
        <IconVolume />
      ) : volume > 0 ? (
        <IconVolume2 />
      ) : (
        <IconVolume3 />
      )}
    </Button>
  )
}
