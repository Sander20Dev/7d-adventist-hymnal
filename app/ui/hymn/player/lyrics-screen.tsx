'use client'

import { getMinTime } from '@/app/lib/hymn/time'
import { DividedLyric, Hymn, TextColor, Thumbnail } from '@/app/lib/types'
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
import { AudioControllerCtx, GeneralProvider } from './provider'
import { useContext } from 'react'
import { Button } from './actions/button'

export default function LyricsScreen({
  lyrics,
  hymn,
  thumbnail,
}: {
  lyrics: DividedLyric[]
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
    focused,
    time,
    volume,

    handleFullscreen,
    handleMute,
    handleVolume,
    handleNext,
    handlePlay,
    handlePrev,
    handleMobileFocus,

    handleMobilePlay,

    mobile,
    audioCtllr,
  } = useAudio(hymn, lyrics)

  return (
    <GeneralProvider.Provider
      value={{ mobile, textColor: thumbnail.textColor }}>
      <AudioControllerCtx.Provider value={audioCtllr}>
        <div className='h-dvh grid select-none'>
          <Back
            href={'/hymns/' + hymn.number}
            className={clsx('transition', {
              '-top-full scale-0': !focused,
            })}
          />
          <div
            onClick={handleMobileFocus}
            onDoubleClick={handleMobilePlay}
            className='h-dvh max-h-dvh flex flex-row transition'
            style={{ transform: `translateX(-${(index + 1) * 100}vw)` }}>
            <TitleScreen hymn={hymn} />
            {lyrics.map((lyric, i) =>
              lyric.lines.map((lines, j) => (
                <Screen key={'lyric-' + i + ':verse-' + j}>
                  {lines.map((line, k) => (
                    <p
                      key={'lyric-' + i + ':verse-' + j + ':' + k}
                      className='text-xl sm:text-2xl md:text-3xl'>
                      {line}
                    </p>
                  ))}
                </Screen>
              ))
            )}
            <TitleScreen hymn={hymn} />
          </div>
          <div
            className={clsx('fixed bottom-0 left-0 right-0 transition-all', {
              'h-12': !focused,
              'h-32': focused,
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
                <ThumbnailIcons icon={thumbnail.icon} />
                {hymn.verseAssociated != null && (
                  <>
                    {' '}
                    | <span>{hymn.verseAssociated}</span>
                  </>
                )}
              </div>
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
                  'scale-y-0 translate-y-1': !focused,
                }
              )}>
              <section>
                <input
                  type='range'
                  step={1}
                  min={0}
                  max={
                    audio.current?.duration == null ||
                    isNaN(audio.current?.duration)
                      ? 0
                      : audio.current.duration
                  }
                  value={time}
                  onChange={(ev) =>
                    audio.current &&
                    (audio.current.currentTime = +ev.target.value)
                  }
                  className='w-full'
                />
              </section>
              <section className='flex flex-row gap-2 justify-between [&_section]:flex [&_section]:flex-row [&_section]:gap-2 [&_section]:items-center [&_button:hover]:scale-105'>
                <section>
                  <Button label='Anterior' onClick={handlePrev}>
                    <IconPlayerTrackPrev />
                  </Button>
                  <Button
                    label={!played ? 'Reproducir' : 'Pausar'}
                    onClick={handlePlay}
                    disabled={!loaded}>
                    {!played ? <IconPlayerPlay /> : <IconPlayerPause />}
                  </Button>
                  <Button label='Siguiente' onClick={handleNext}>
                    <IconPlayerTrackNext />
                  </Button>
                  {!mobile && (
                    <>
                      <Button
                        onClick={handleMute}
                        label='Silenciar'
                        className='ml-2'>
                        {muted ? (
                          <IconVolumeOff />
                        ) : volume > 50 ? (
                          <IconVolume />
                        ) : volume > 0 ? (
                          <IconVolume2 />
                        ) : (
                          <IconVolume3 />
                        )}
                      </Button>
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
                    {getMinTime(
                      isNaN(audio.current?.duration ?? NaN)
                        ? undefined
                        : audio.current?.duration
                    )}
                  </span>
                  <Button
                    label='Pantalla completa'
                    onClick={handleFullscreen}
                    className='ml-2'>
                    {fullscreen ? <IconMinimize /> : <IconMaximize />}
                  </Button>
                </section>
              </section>
            </section>
          </div>
        </div>
      </AudioControllerCtx.Provider>
    </GeneralProvider.Provider>
  )
}

export function TitleScreen({ hymn }: { hymn: Hymn }) {
  return (
    <Screen>
      <h1 className='flex justify-center w-fit'>
        <p className='w-fit border-r-4 pr-2 border-current'>{hymn.number}</p>
        <p className='w-fit text-start pl-2'>{hymn.name}</p>
      </h1>
    </Screen>
  )
}

export function Screen({ children }: React.PropsWithChildren) {
  const { textColor } = useContext(GeneralProvider)

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
