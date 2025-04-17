import { useMemo } from 'react'
import { Hymn, DividedLyric } from '../../types'
import { useFocus } from './player'
import { useIndex } from './timestamp'

export function useAudio(
  audio: HTMLAudioElement,
  hymn: Hymn,
  lyrics: DividedLyric[],
  open: boolean
) {
  const timestamps = useMemo<number[]>(() => {
    let i = 0
    return [
      0,
      ...lyrics.flatMap((dLyrics) => {
        return dLyrics.lines.map((lines) => {
          const index = i
          i += lines.length
          return hymn.timestamps[index] ?? 0
        })
      }),
      hymn.timestamps[hymn.timestamps.length - 1] ?? 0,
    ]
  }, [hymn, lyrics])

  const mobile = useMemo(() => {
    if ((navigator as any)?.userAgentData) {
      return (navigator as any).userAgentData.mobile as boolean
    }
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) as boolean
  }, [])

  const { focused, activeFocus, toogleFocus } = useFocus(mobile)

  const { index, goNext, goPrev } = useIndex(
    activeFocus,
    timestamps,
    audio,
    open
  )

  const handlePlay = () => {
    activeFocus()
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
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
    index,
    focused,
    activeFocus,
    handleMobileFocus,
    handleMobilePlay,
    mobile,
    goPrev,
    goNext,
  }
}
