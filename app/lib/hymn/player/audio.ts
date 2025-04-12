import { useEffect, useMemo, useRef, useState } from 'react'
import { Hymn, DividedLyric } from '../../types'
import { addHistoryOfHymnsStorage } from '../../storage/history-of-hymns'
import { AudioController } from '@/app/ui/hymn/player/provider'
import {
  useFocus,
  useFullscreen,
  useMuted,
  usePlay,
  useTime,
  useVolume,
} from './player'
import { useIndex } from './timestamp'

export function useAudio(hymn: Hymn, lyrics: DividedLyric[]) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const timestamps = useMemo(() => {
    let i = 0
    return [
      0,
      ...lyrics.flatMap((dLyrics) => {
        return dLyrics.lines.map((_, j) => {
          const index = i
          i += dLyrics.lines.length
          return hymn.timestamps[index]
        })
      }),
      hymn.timestamps[hymn.timestamps.length - 1],
    ]
  }, [hymn, lyrics])

  const [loaded, setLoaded] = useState(audio.current != null)

  const mobile = useMemo(() => {
    if ((navigator as any)?.userAgentData) {
      return (navigator as any).userAgentData.mobile as boolean
    }
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) as boolean
  }, [])

  useEffect(() => {
    if (audio.current == null) {
      audio.current = new Audio()
      audio.current.src =
        'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-' +
        hymn.number +
        '.mp3'
      audio.current.addEventListener('loadeddata', () => setLoaded(true))
      audio.current.load()
    }

    addHistoryOfHymnsStorage(hymn.number)

    return () => {
      audio.current?.pause()
      audio.current?.remove()
    }
  }, [hymn.number])

  const { focused, activeFocus, toogleFocus } = useFocus(mobile)

  const played = usePlay(activeFocus, audio.current ?? undefined)
  const { muted, setMuted } = useMuted(activeFocus, audio.current ?? undefined)
  const volume = useVolume(activeFocus, audio.current ?? undefined)
  const time = useTime(activeFocus, audio.current ?? undefined)
  const fullscreen = useFullscreen(activeFocus, audio.current ?? undefined)

  const { index, goNext, goPrev, goTo } = useIndex(
    activeFocus,
    time,
    timestamps,
    audio.current ?? undefined
  )

  const handlePrev = goPrev
  const handleNext = goNext

  const audioCtllr: AudioController = {
    audio: audio.current,
    played: {
      current: played,
      set(val: boolean) {
        if (val) {
          audio.current?.play()
        } else {
          audio.current?.pause()
        }
      },
    },
    volume: {
      current: volume,
      set(val: number) {
        if (audio.current == null) return
        audio.current.volume = val / 100
      },
    },
    muted: {
      current: muted,
      set(val: boolean) {
        if (audio.current == null) return
        setMuted(val)
      },
    },
    time: {
      current: time,
      set(val: number) {
        if (audio.current) {
          audio.current.currentTime = val
        }
      },
    },
    index: {
      current: index,
      set(val: number) {
        goTo(val)
      },
    },
  }

  const handlePlay = () => {
    if (audio.current == null) return

    activeFocus()
    audioCtllr.played.set(audio.current.paused)
  }
  const handleMute = () => {
    if (audio.current == null) return

    activeFocus()
    audioCtllr.muted.set(!audioCtllr.muted.current)
  }
  const handleVolume = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (audio.current == null) return

    activeFocus()
    audioCtllr.volume.set(+target.value)
  }

  const handleFullscreen = () => {
    activeFocus()
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  const handleMobilePlay = mobile ? handlePlay : handleFullscreen
  const handleMobileFocus = mobile ? toogleFocus : handlePlay

  return {
    audio,
    loaded,

    fullscreen,
    muted,
    volume,
    played,
    index,
    focused,
    time,

    handleFullscreen,
    handleMute,
    handleNext,
    handlePlay,
    handleMobilePlay,
    handlePrev,
    activeFocus,
    handleMobileFocus,
    handleVolume,

    mobile,
    audioCtllr,
  }
}
