'use client'

import { getMinTime } from '@/app/lib/hymn/time'
import { Hymn, Lyric, TextColor, Thumbnail } from '@/app/lib/types'
import {
  IconMaximize,
  IconMinimize,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconVolumeOff,
} from '@tabler/icons-react'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

const numbers = Array(10)
  .fill(0)
  .map((_, i) => i.toString())

export default function LyricsScreen({
  lyrics,
  hymn,
  thumbnail,
}: {
  lyrics: Lyric[]
  hymn: Hymn
  thumbnail: Thumbnail
}) {
  const [index, setIndex] = useState(-1)
  const audio = useRef(
    new Audio(
      'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-' +
        hymn.number +
        '.mp3'
    )
  )

  const [played, setPlayed] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [time, setTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const isPlayed = () => setPlayed(!audio.current.paused)
    audio.current.addEventListener('play', isPlayed)
    audio.current.addEventListener('pause', isPlayed)
    const getTime = () => setTime(audio.current.currentTime)
    audio.current.addEventListener('timeupdate', getTime)

    document.addEventListener('fullscreenchange', () => {
      setFullscreen(document.fullscreenElement != null)
    })

    audio.current.load()
  }, [])

  useEffect(() => {
    audio.current.muted = muted
  }, [muted])
  useEffect(() => {
    audio.current.volume = volume / 100
  }, [volume])
  useEffect(() => {
    console.log(time)
    if (hymn.steps == null) return
    const step = hymn.steps.findIndex(
      (t, i, arr) => t <= time && time < (arr[i + 1] ?? Infinity)
    )
    console.log(step)
    if (step < 0) return

    setIndex(step - 1)
  }, [time])

  const refreshIndex = (index: number) => {
    if (hymn.steps == null) return
    audio.current.currentTime = hymn.steps[index]
  }

  const handlePrev = () => {
    if (index < 0) return
    setIndex(index - 1)
    refreshIndex(index)
  }
  const handleNext = () => {
    if (index + 1 > lyrics.length) return
    setIndex(index + 1)
    refreshIndex(index + 2)
  }

  const handlePlay = () => {
    if (audio.current.paused) {
      audio.current.play()
    } else {
      audio.current.pause()
    }
  }
  const handleMute = () => {
    setMuted(!muted)
  }

  const handleFullscreen = () => {
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
      const num = +ev.key
      audio.current.currentTime = audio.current.duration * num * 0.1
    }
  }

  return (
    <div className='h-screen grid'>
      <div
        className='h-screen max-h-screen flex flex-row transition'
        style={{ transform: `translateX(-${(index + 1) * 100}vw)` }}>
        <TitleScreen hymn={hymn} textColor={thumbnail.textColor} />
        {lyrics.map((lyric, i) => (
          <section
            key={'lyric' + i}
            className='flex flex-col justify-center items-center w-screen h-full'>
            <div
              className={clsx(
                'bg-backdrop p-xl sm:p-2xl md:p-3xl rounded-md text-center',
                {
                  'bg-white': thumbnail.textColor === TextColor.Black,
                  'bg-black': thumbnail.textColor === TextColor.White,
                }
              )}>
              {lyric.verses.map((verse, j) => (
                <p
                  key={'lyric-' + i + ':verse-' + j}
                  className='text-xl sm:text-2xl md:text-3xl'>
                  {verse}
                </p>
              ))}
            </div>
          </section>
        ))}
        <TitleScreen hymn={hymn} textColor={thumbnail.textColor} />
      </div>
      <div className='fixed bottom-0 left-0 right-0'>
        <section
          className={clsx(
            'grid grid-rows-2 p-2 w-full h-20 bg-backdrop origin-bottom',
            {
              'bg-white': thumbnail.textColor === TextColor.Black,
              'bg-black': thumbnail.textColor === TextColor.White,
            }
          )}>
          <section>
            <input
              type='range'
              step={1}
              min={0}
              max={audio.current.duration}
              value={time}
              onChange={(ev) => (audio.current.currentTime = +ev.target.value)}
              className='w-full'
            />
          </section>
          <section className='flex flex-row gap-2 [&_button:hover]:scale-105'>
            <button onClick={handlePrev}>
              <IconPlayerTrackPrev />
            </button>
            <button onClick={handlePlay}>
              {!played ? <IconPlayerPlay /> : <IconPlayerPause />}
            </button>
            <button onClick={handleNext}>
              <IconPlayerTrackNext />
            </button>
            <button onClick={handleMute} className='ml-2'>
              {muted ? (
                <IconVolumeOff />
              ) : volume > 50 ? (
                <IconVolume />
              ) : volume > 0 ? (
                <IconVolume2 />
              ) : (
                <IconVolume3 />
              )}
            </button>
            <input
              type='range'
              step={1}
              min={0}
              max={100}
              onChange={(ev) => setVolume(+ev.target.value)}
              value={volume}
            />
            <div className='w-full'></div>
            <span className='text-nowrap'>
              {getMinTime(time)} /{' '}
              {isNaN(audio.current.duration)
                ? '--:--'
                : getMinTime(audio.current.duration)}
            </span>
            <button onClick={handleFullscreen} className='ml-2'>
              {fullscreen ? <IconMinimize /> : <IconMaximize />}
            </button>
          </section>
        </section>
      </div>
    </div>
  )
}

function TitleScreen({
  hymn,
  textColor,
}: {
  hymn: Hymn
  textColor: TextColor
}) {
  return (
    <section className='flex flex-col justify-center items-center w-screen h-full'>
      <div
        className={clsx(
          'bg-backdrop p-xl sm:p-2xl md:p-3xl rounded-md text-center',
          {
            'bg-white': textColor === TextColor.Black,
            'bg-black': textColor === TextColor.White,
          }
        )}>
        <h1>
          {hymn.number} | {hymn.title}
        </h1>
      </div>
    </section>
  )
}
