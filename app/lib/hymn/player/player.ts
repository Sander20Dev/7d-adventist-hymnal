import { useEffect, useRef, useState } from 'react'
import { getMutedStorage, setMutedStorage } from '../../storage/muted'
import { getVolumeStorage, setVolumeStorage } from '../../storage/volume'

export function useFocus(mobile: boolean) {
  const [focused, setFocused] = useState(true)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const activeFocusWithMouse = () => {
      activeFocus()
    }

    const activeFocusWithKey = (ev: KeyboardEvent) => {
      if (ev.key === '.') {
        ev.preventDefault()
        toogleFocus()
      }
    }

    window.addEventListener('keydown', activeFocusWithKey)
    window.addEventListener('mousemove', activeFocusWithMouse)

    return () => {
      window.removeEventListener('keydown', activeFocusWithKey)
      window.removeEventListener('mousemove', activeFocusWithMouse)
    }
  })

  const activeFocus = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }

    setFocused(true)

    timer.current = window.setTimeout(
      () => {
        setFocused(false)
      },
      mobile ? 5000 : 2000
    )
  }

  const toogleFocus = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }

    if (!focused) {
      activeFocus()
    } else {
      setFocused(false)
    }
  }

  return { focused, activeFocus, toogleFocus }
}

export function usePlay(activeFocus: () => void, audio?: HTMLAudioElement) {
  const [played, setPlayed] = useState(!(audio?.paused ?? true))

  useEffect(() => {
    if (audio == null) return
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
  }, [audio])

  useEffect(() => {
    const tooglePlayWithKey = (ev: KeyboardEvent) => {
      if (ev.key === ' ') {
        ev.preventDefault()
        audio?.play()
      }
    }
    window.addEventListener('keydown', tooglePlayWithKey)
    return () => {
      window.removeEventListener('keydown', tooglePlayWithKey)
    }
  }, [audio])

  return played
}

export function useMuted(activeFocus: () => void, audio?: HTMLAudioElement) {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (audio == null) return

    setMuted(getMutedStorage)
  }, [audio])

  useEffect(() => {
    if (audio == null) return

    audio.muted = muted
    setMutedStorage(muted)
    activeFocus()
  }, [audio, muted])

  useEffect(() => {
    if (audio == null) return

    setMuted(audio.muted)

    const toogleMuteWithKey = (ev: KeyboardEvent) => {
      if (audio == null) return
      if (ev.key === 'm') {
        ev.preventDefault()
        setMuted(!muted)
      }
    }
    window.addEventListener('keydown', toogleMuteWithKey)
    return () => {
      window.removeEventListener('keydown', toogleMuteWithKey)
    }
  }, [audio, muted])

  return { muted, setMuted }
}

export function useVolume(activeFocus: () => void, audio?: HTMLAudioElement) {
  const [volume, setVolume] = useState(100)

  useEffect(() => {
    if (audio == null) return
    const updateVolume = () => {
      setVolume(audio.volume * 100)
      setVolumeStorage(audio.volume * 100)
      activeFocus()
    }
    audio.addEventListener('volumechange', updateVolume)
    return () => {
      audio.removeEventListener('volumechange', updateVolume)
    }
  }, [audio])

  useEffect(() => {
    if (audio == null) return

    audio.volume = getVolumeStorage() / 100

    const chageVolumeWithKey = (ev: KeyboardEvent) => {
      if (audio == null) return
      if (ev.key === 'ArrowUp') {
        ev.preventDefault()
        audio.volume = Math.min(audio.volume + 10, 100) / 100
      }
      if (ev.key === 'ArrowDown') {
        ev.preventDefault()
        audio.volume = Math.max(audio.volume - 10, 0) / 100
      }
    }
    window.addEventListener('keydown', chageVolumeWithKey)
    return () => {
      window.removeEventListener('keydown', chageVolumeWithKey)
    }
  }, [audio])

  return volume
}

const numbers = Array.from({ length: 10 }, (_, i) => i.toString())
export function useTime(activeFocus: () => void, audio?: HTMLAudioElement) {
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
    if (audio == null) return

    const changeTimwWithKey = (ev: KeyboardEvent) => {
      if (numbers.includes(ev.key)) {
        if (audio == null) return
        const num = +ev.key
        audio.currentTime = audio.duration * num * 0.1
      }
    }

    window.addEventListener('keydown', changeTimwWithKey)

    return () => {
      window.removeEventListener('keydown', changeTimwWithKey)
    }
  }, [audio])

  return time
}

export function useFullscreen(
  activeFocus: () => void,
  audio?: HTMLAudioElement
) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (audio == null) return
    const updateFullscreen = () => {
      setFullscreen(document.fullscreenElement != null)
      activeFocus()
    }
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreen)
    }
  }, [audio])

  useEffect(() => {
    if (audio == null) return

    const toogleFullscreenWithKey = (ev: KeyboardEvent) => {
      if (ev.key === 'f') {
        ev.preventDefault()
        handleFullscreen()
      }
    }
    window.addEventListener('keydown', toogleFullscreenWithKey)
    return () => {
      window.removeEventListener('keydown', toogleFullscreenWithKey)
    }
  }, [audio])

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  return fullscreen
}
