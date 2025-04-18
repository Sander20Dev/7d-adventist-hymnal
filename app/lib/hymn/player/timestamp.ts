import { useEffect, useState } from 'react'

export function useIndex(
  activeFocus: () => void,
  timestamps: number[],
  audio: HTMLAudioElement
) {
  const [index, setIndex] = useState(-1)

  const goPrev = () => {
    if (index < 0) return
    activeFocus()
    setIndex(index - 1)
    refreshIndex(index)
  }
  const goNext = () => {
    console.log(index, index + 2)
    if (index + 2 > timestamps.length - 1) return
    activeFocus()
    setIndex(index + 1)
    refreshIndex(index + 2)
  }

  useEffect(() => {
    const refreshingIndexWhenSeeking = () => {
      const step = timestamps.findIndex(
        (t, i, arr) =>
          t <= audio.currentTime && audio.currentTime < (arr[i + 1] ?? Infinity)
      )

      if (step < 0) return
      if (step - 1 === index) return

      setIndex(step - 1)
    }

    audio.addEventListener('timeupdate', refreshingIndexWhenSeeking)

    return () => {
      audio.removeEventListener('timeupdate', refreshingIndexWhenSeeking)
    }
  }, [index])

  const refreshIndex = (index: number) => {
    console.log(index, timestamps.length)
    audio.currentTime = timestamps[index]
  }

  const goTo = (index: number) => {
    if (index < 0) return
    if (index + 1 > timestamps.length) return

    setIndex(index)
    refreshIndex(index)
  }

  return { index, refreshIndex, goPrev, goNext, goTo }
}
