'use client'

import { getMinTime } from '@/app/lib/hymn/time'
import { getMutedStorage, setMutedStorage } from '@/app/lib/storage/muted'
import { getVolumeStorage, setVolumeStorage } from '@/app/lib/storage/volume'
import { Hymn, Lyric, TextColor, Thumbnail } from '@/app/lib/types'
import {
  IconExclamationCircle,
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
import Back from '../back'
import ThumbnailIcons from '../../icons'

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
  const [muted, setMuted] = useState(getMutedStorage)
  const [volume, setVolume] = useState(getVolumeStorage)
  const [time, setTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [visible, setVisible] = useState(true)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const isPlayed = () => setPlayed(!audio.current.paused)
    audio.current.addEventListener('play', isPlayed)
    audio.current.addEventListener('pause', isPlayed)
    const getTime = () => setTime(audio.current.currentTime)
    audio.current.addEventListener('timeupdate', getTime)

    audio.current.addEventListener('loadeddata', () => setLoaded(true))

    document.addEventListener('fullscreenchange', () => {
      setFullscreen(document.fullscreenElement != null)
    })

    audio.current.load()
  }, [])

  useEffect(() => {
    audio.current.muted = muted
    setMutedStorage(muted)
  }, [muted])
  useEffect(() => {
    audio.current.volume = volume / 100
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

    handleVisible()
  }

  const handleVisible = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }

    setVisible(true)

    if (!audio.current.paused) {
      timer.current = window.setTimeout(() => {
        setVisible(false)
      }, 2000)
    }
  }

  window.onmousemove = handleVisible

  return (
    <div className='h-screen grid'>
      <Back
        href={'/hymns/' + hymn.number}
        className={clsx('transition', {
          '-top-full scale-0': !visible,
        })}
      />
      <div
        className='h-screen max-h-screen flex flex-row transition'
        style={{ transform: `translateX(-${(index + 1) * 100}vw)` }}>
        <TitleScreen hymn={hymn} textColor={thumbnail.textColor} />
        {lyrics.map((lyric, i) => (
          <Screen key={'lyric' + i} textColor={thumbnail.textColor}>
            {lyric.verses.map((verse, j) => (
              <p
                key={'lyric-' + i + ':verse-' + j}
                className='text-xl sm:text-2xl md:text-3xl'>
                {verse}
              </p>
            ))}
          </Screen>
        ))}
        <TitleScreen hymn={hymn} textColor={thumbnail.textColor} />
      </div>
      <div
        className={clsx('fixed bottom-0 left-0 right-0 transition-all', {
          'h-12': !visible,
          'h-32': visible,
        })}>
        <section className='flex flex-row gap-2 m-2 h-8'>
          <div
            className={clsx(
              'w-fit p-base bg-backdrop rounded-md h-8 border text-nowrap whitespace-nowrap flex gap-1',
              {
                'bg-white text-black border-gray-200':
                  thumbnail.textColor === TextColor.Black,
                'bg-black text-white border-gray-800':
                  thumbnail.textColor === TextColor.White,
              }
            )}>
            <ThumbnailIcons icon={thumbnail.icon} /> | <span>{hymn.verse}</span>
          </div>
          {hymn.steps == null && (
            <div
              onClick={() => {
                const sure = window.confirm('¿Estas seguro(a)?')
                if (sure) {
                  fetch('/api', {
                    headers: {
                      'content-type': 'application/json',
                    },
                    body: JSON.stringify({ hymnNumber: hymn.number }),
                    method: 'POST',
                  })
                    .then((n) => n.json())
                    .then((n) => console.log(n))
                }
              }}
              className={clsx(
                'w-fit p-1 bg-backdrop rounded-md h-8 border hover:bg-opacity-75 [&:hover>svg]:animate-horizontal-vibration animate-duration-fast [&:hover>svg]:animate-iteration-count-once text-nowrap whitespace-nowrap flex gap-1',
                {
                  'bg-white text-red-400 border-gray-200':
                    thumbnail.textColor === TextColor.Black,
                  'bg-black text-red-600 border-gray-800':
                    thumbnail.textColor === TextColor.White,
                }
              )}>
              <IconExclamationCircle /> <span>Pedir Marcas de Tiempo</span>
            </div>
          )}
        </section>
        <section
          className={clsx(
            'grid grid-rows-2 p-2 w-full h-20 bg-backdrop origin-bottom transition border-t',
            {
              'bg-white border-gray-200':
                thumbnail.textColor === TextColor.Black,
              'bg-black border-gray-800':
                thumbnail.textColor === TextColor.White,
            },
            {
              'scale-y-0 translate-y-1': !visible,
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
          <section className='flex flex-row gap-2 justify-between [&_section]:flex [&_section]:flex-row [&_section]:gap-2 [&_section]:items-center [&_button:hover]:scale-105'>
            <section>
              <button onClick={handlePrev}>
                <IconPlayerTrackPrev />
              </button>
              <button onClick={handlePlay} disabled={!loaded}>
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
                className='w-full max-w-32'
              />
            </section>
            <section>
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
    <Screen textColor={textColor}>
      <h1>
        {hymn.number} | {hymn.title}
      </h1>
    </Screen>
  )
}

interface ScreenProps {
  textColor: TextColor
}

function Screen({ textColor, children }: React.PropsWithChildren<ScreenProps>) {
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
        {children}
      </div>
    </section>
  )
}
