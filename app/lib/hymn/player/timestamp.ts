import { useEffect, useState } from 'react'
import { waitForKey } from './keys'

export function useIndex(
  activeFocus: () => void,
  time: number,
  timestamps: number[],
  audio: HTMLAudioElement | undefined | null,
  keysBlocked: boolean
) {
  const [index, setIndex] = useState(-1)

  const goPrev = () => {
    if (index < 0) return
    activeFocus()
    setIndex(index - 1)
    refreshIndex(index)
  }
  const goNext = () => {
    if (index + 1 > timestamps.length) return
    activeFocus()
    setIndex(index + 1)
    refreshIndex(index + 2)
  }

  useEffect(() => {
    const step = timestamps.findIndex(
      (t, i, arr) => t <= time && time < (arr[i + 1] ?? Infinity)
    )

    if (step < 0) return

    setIndex(step - 1)
  }, [time, timestamps])

  useEffect(() => {
    if (keysBlocked) return
    const goPrevKey = waitForKey({ key: 'ArrowLeft' }, goPrev)
    const goNextKey = waitForKey({ key: 'ArrowRight' }, goNext)

    const goToIndexWithKey = (ev: KeyboardEvent) => {
      goPrevKey(ev)
      goNextKey(ev)
    }
    window.addEventListener('keydown', goToIndexWithKey)
    return () => {
      window.removeEventListener('keydown', goToIndexWithKey)
    }
  }, [index, keysBlocked])

  const refreshIndex = (index: number) => {
    if (audio != null) {
      audio.currentTime = timestamps[index]
    }
  }

  const goTo = (index: number) => {
    if (index < 0) return
    if (index + 1 > timestamps.length) return

    setIndex(index)
    refreshIndex(index)
  }

  return { index, refreshIndex, goPrev, goNext, goTo }
}
