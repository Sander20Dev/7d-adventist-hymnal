import { useEffect, useRef, useState } from 'react'
import { getMutedStorage, setMutedStorage } from '../../storage/muted'
import { getVolumeStorage, setVolumeStorage } from '../../storage/volume'
import { waitForKey } from './keys'

export function useFocus(mobile: boolean) {
  const [focused, setFocused] = useState(true)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const activeFocusWithMouse = () => {
      activeFocus()
    }

    const activeFocusKey = waitForKey({ key: '.' }, toogleFocus)

    const activeFocusWithKey = (ev: KeyboardEvent) => {
      activeFocusKey(ev)
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

export function usePlay(
  activeFocus: () => void,
  audio: HTMLAudioElement | undefined | null,
  keysBlocked: boolean
) {
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
    if (keysBlocked) return

    const tooglePlayKey = waitForKey({ key: ' ' }, () => {
      if (audio == null) return
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
    })

    const tooglePlayWithKey = (ev: KeyboardEvent) => {
      tooglePlayKey(ev)
    }
    window.addEventListener('keydown', tooglePlayWithKey)
    return () => {
      window.removeEventListener('keydown', tooglePlayWithKey)
    }
  }, [audio, keysBlocked])

  return played
}

export function useMuted(
  activeFocus: () => void,
  audio: HTMLAudioElement | undefined | null,
  keysBlocked: boolean
) {
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
    if (keysBlocked) return
    if (audio == null) return

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

  return { muted, setMuted }
}

export function useVolume(
  activeFocus: () => void,
  audio: HTMLAudioElement | undefined | null,
  keysBlocked: boolean
) {
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
    if (keysBlocked) return
    if (audio == null) return

    audio.volume = getVolumeStorage() / 100

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

  return volume
}

const numbers = Array.from({ length: 10 }, (_, i) => i.toString())
export function useTime(
  activeFocus: () => void,
  audio: HTMLAudioElement | undefined | null,
  keysBlocked: boolean
) {
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

  return time
}

export function useFullscreen(
  activeFocus: () => void,
  audio: HTMLAudioElement | undefined | null,
  keysBlocked: boolean
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
    if (keysBlocked) return
    if (audio == null) return

    const toogleFullscreenKey = waitForKey({ key: 'f' }, handleFullscreen)

    const toogleFullscreenWithKey = (ev: KeyboardEvent) => {
      toogleFullscreenKey(ev)
    }
    window.addEventListener('keydown', toogleFullscreenWithKey)
    return () => {
      window.removeEventListener('keydown', toogleFullscreenWithKey)
    }
  }, [audio, keysBlocked])

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  return fullscreen
}
