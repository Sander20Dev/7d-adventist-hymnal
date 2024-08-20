import { useEffect, useMemo, useRef, useState } from 'react'
import { Hymn, Lyric } from '../../types'
import { getMutedStorage, setMutedStorage } from '../../storage/muted'
import { getVolumeStorage, setVolumeStorage } from '../../storage/volume'
import { addHistoryOfHymnsStorage } from '../../storage/history-of-hymns'

const numbers = Array(10)
  .fill(0)
  .map((_, i) => i.toString())

export function useAudio(hymn: Hymn, lyrics: Lyric[]) {
  const [index, setIndex] = useState(-1)
  const audio = useRef<HTMLAudioElement | null>(null)

  const [played, setPlayed] = useState(false)
  const [muted, setMuted] = useState(getMutedStorage)
  const [volume, setVolume] = useState(getVolumeStorage)
  const [time, setTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [visible, setVisible] = useState(true)
  const timer = useRef<number | null>(null)

  const mobile = useMemo(() => {
    if ((navigator as any)?.userAgentData) {
      return (navigator as any).userAgentData.mobile as boolean
    }
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) as boolean
  }, [])

  useEffect(() => {
    audio.current = new window.Audio(
      'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-' +
        hymn.number +
        '.mp3'
    )

    const isPlayed = () => setPlayed(!audio.current!.paused)
    audio.current.addEventListener('play', isPlayed)
    audio.current.addEventListener('pause', isPlayed)
    const getTime = () => setTime(audio.current!.currentTime)
    audio.current.addEventListener('timeupdate', getTime)

    audio.current.addEventListener('loadeddata', () => setLoaded(true))

    document.addEventListener('fullscreenchange', () => {
      setFullscreen(document.fullscreenElement != null)
    })

    audio.current.load()

    addHistoryOfHymnsStorage(hymn.number)
  }, [])

  useEffect(() => {
    audio.current!.muted = muted
    setMutedStorage(muted)
  }, [muted])
  useEffect(() => {
    audio.current!.volume = volume / 100
    setVolumeStorage(volume)
  }, [volume])
  useEffect(() => {
    if (hymn.steps == null) return
    const step = hymn.steps.findIndex(
      (t, i, arr) => t <= time && time < (arr[i + 1] ?? Infinity)
    )

    if (step < 0) return

    setIndex(step - 1)
  }, [time])

  const refreshIndex = (index: number) => {
    if (hymn.steps == null) return
    if (audio.current) {
      audio.current.currentTime = hymn.steps[index]
    }
  }

  const handlePrev = () => {
    handleVisible()
    if (index < 0) return
    setIndex(index - 1)
    refreshIndex(index)
  }
  const handleNext = () => {
    handleVisible()
    if (index + 1 > lyrics.length) return
    setIndex(index + 1)
    refreshIndex(index + 2)
  }

  const handlePlay = () => {
    handleVisible()
    if (audio.current == null) return
    if (audio.current.paused) {
      audio.current.play()
    } else {
      audio.current.pause()
    }
  }
  const handleMute = () => {
    handleVisible()
    setMuted(!muted)
  }
  const handleVolume = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    handleVisible()
    setVolume(+target.value)
  }

  const handleFullscreen = () => {
    handleVisible()
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  window.onkeydown = (ev) => {
    if (ev.key === 'ArrowLeft') {
      handlePrev()
    }
    if (ev.key === 'ArrowRight') {
      handleNext()
    }
    if (ev.key === ' ') {
      handlePlay()
    }
    if (ev.key === 'ArrowUp') {
      if (volume < 100) {
        setVolume(Math.min(volume + 10, 100))
      }
    }
    if (ev.key === 'ArrowDown') {
      if (volume > 1) {
        setVolume(Math.max(volume - 10, 0))
      }
    }
    if (ev.key.toLowerCase() === 'm') {
      handleMute()
    }
    if (ev.key.toLowerCase() === 'f') {
      handleFullscreen()
    }
    if (numbers.includes(ev.key)) {
      if (audio.current == null) return
      const num = +ev.key
      audio.current.currentTime = audio.current.duration * num * 0.1
    }
    if (ev.key === '.') {
      handleVisible()
    }
  }

  const handleVisible = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }

    setVisible(true)

    if (audio.current && audio.current.paused) {
      timer.current = window.setTimeout(
        () => {
          setVisible(false)
        },
        mobile ? 5000 : 2000
      )
    }
  }

  const handleToggleVisible = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }

    if (!visible) {
      handleVisible()
    } else {
      setVisible(false)
    }
  }

  window.onmousemove = handleVisible

  const handleMobilePlay = mobile ? handlePlay : handleFullscreen
  const handleMobileVisible = mobile ? handleToggleVisible : handlePlay

  return {
    audio,
    loaded,

    fullscreen,
    muted,
    volume,
    played,
    index,
    visible,
    time,

    handleFullscreen,
    handleMute,
    handleNext,
    handlePlay,
    handleMobilePlay,
    handlePrev,
    handleVisible,
    handleMobileVisible,
    handleVolume,

    mobile,
  }
}
