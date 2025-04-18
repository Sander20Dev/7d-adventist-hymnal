import { useMemo } from 'react'
import { Hymn, DividedLyric } from '../../types'
import { useFocus } from './player'
import { useIndex } from './timestamp'

export function useAudio(
  audio: HTMLAudioElement,
  hymn: Hymn,
  lyrics: DividedLyric[]
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
  }, [])

  const { focused, activeFocus, toogleFocus } = useFocus()

  const { index, goNext, goPrev } = useIndex(activeFocus, timestamps, audio)

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

  return {
    index,
    focused,
    activeFocus,
    handleFullscreen,
    handlePlay,
    goPrev,
    goNext,
  }
}
