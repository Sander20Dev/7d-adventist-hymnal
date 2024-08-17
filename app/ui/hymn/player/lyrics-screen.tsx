'use client'

import { getMinTime } from '@/app/lib/hymn/time'
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
import Back from '../back'
import ThumbnailIcons from '../../icons'
import { useAudio } from '@/app/lib/hymn/player/audio'

export default function LyricsScreen({
  lyrics,
  hymn,
  thumbnail,
}: {
  lyrics: Lyric[]
  hymn: Hymn
  thumbnail: Thumbnail
}) {
  const {
    audio,
    loaded,

    fullscreen,
    index,
    muted,
    played,
    visible,
    time,
    volume,

    handleFullscreen,
    handleMute,
    handleVolume,
    handleNext,
    handlePlay,
    handlePrev,
    handleMobileVisible,

    handleMobilePlay,

    mobile,
  } = useAudio(hymn, lyrics)

  return (
    <div className='h-dvh grid select-none'>
      <Back
        href={'/hymns/' + hymn.number}
        className={clsx('transition', {
          '-top-full scale-0': !visible,
        })}
      />
      <div
        onClick={handleMobileVisible}
        onDoubleClick={handleMobilePlay}
        className='h-dvh max-h-dvh flex flex-row transition'
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
              {!mobile && (
                <>
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
                    onChange={handleVolume}
                    value={volume}
                    className='w-full max-w-32'
                  />
                </>
              )}
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
      <h1 className='flex justify-center w-fit'>
        <p className='w-fit border-r-4 pr-2 border-current'>{hymn.number}</p>
        <p className='w-fit text-start pl-2'>{hymn.title}</p>
      </h1>
    </Screen>
  )
}

interface ScreenProps {
  textColor: TextColor
}

function Screen({ textColor, children }: React.PropsWithChildren<ScreenProps>) {
  return (
    <section className='flex flex-col justify-center items-center w-screen h-full p-4'>
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
