'use client'

import { DividedLyric, Hymn, TextColor, Thumbnail } from '@/app/lib/types'
import clsx from 'clsx'
import LyricsScreen from './lyrics-screen'
import { useEffect, useRef, useState } from 'react'
import { destroyAudio, getAudio } from '@/app/lib/hymn/player/get-audio'
import LoadingPlayer from './loading-player'

interface HymnPlayerPageProps {
  hymn: Hymn
  thumbnail: Thumbnail
  preparedLyrics: DividedLyric[]
}

export default function HymnPlayerPage({
  hymn,
  thumbnail,
  preparedLyrics,
}: HymnPlayerPageProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    let loadedAudio: HTMLAudioElement | null = null

    setIsLoaded(false)

    getAudio(hymn.number).then((audio) => {
      if (cancelled) {
        destroyAudio(audio)
      } else {
        loadedAudio = audio
        audioRef.current = audio
        setIsLoaded(true)
      }
    })

    return () => {
      cancelled = true
      if (loadedAudio) {
        loadedAudio.pause()
        destroyAudio(loadedAudio)
      }
      audioRef.current = null
    }
  }, [hymn.number])

  if (!isLoaded || audioRef.current == null)
    return <LoadingPlayer thumbnail={thumbnail} />

  return (
    <main
      className={clsx(
        'bg-gray-50 h-dvh overflow-hidden bg-no-repeat bg-cover',
        {
          'bg-center':
            thumbnail.orientation.x === 0 && thumbnail.orientation.y === 0,
          'bg-left-top':
            thumbnail.orientation.x < 0 && thumbnail.orientation.y < 0,
          'bg-right-top':
            thumbnail.orientation.x > 0 && thumbnail.orientation.y < 0,
          'bg-left-bottom':
            thumbnail.orientation.x < 0 && thumbnail.orientation.y > 0,
          'bg-right-bottom':
            thumbnail.orientation.x > 0 && thumbnail.orientation.y > 0,
          'text-white [&_input]:accent-white':
            thumbnail.textColor === TextColor.White,
          'text-black [&_input]:accent-black':
            thumbnail.textColor === TextColor.Black,
        }
      )}
      style={{
        backgroundImage: `url(https://7d-adventist-hymnal.vercel.app/images/full-images/${thumbnail.src}.webp)`,
      }}>
      <LyricsScreen
        lyrics={preparedLyrics}
        hymn={hymn}
        thumbnail={thumbnail}
        audio={audioRef.current}
      />
    </main>
  )
}
