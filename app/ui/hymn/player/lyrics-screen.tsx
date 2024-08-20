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
import { GeneralProvider } from './provider'
import { useContext, useRef, useState } from 'react'

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
    <GeneralProvider.Provider
      value={{ mobile, textColor: thumbnail.textColor }}>
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
          <TitleScreen hymn={hymn} />
          {lyrics.map((lyric, i) => (
            <Screen key={'lyric' + i}>
              {lyric.verses.map((verse, j) => (
                <p
                  key={'lyric-' + i + ':verse-' + j}
                  className='text-xl sm:text-2xl md:text-3xl'>
                  {verse}
                </p>
              ))}
            </Screen>
          ))}
          <TitleScreen hymn={hymn} />
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
              <ThumbnailIcons icon={thumbnail.icon} />
              {hymn.verse != null && (
                <>
                  {' '}
                  | <span>{hymn.verse}</span>
                </>
              )}
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
                max={audio.current?.duration}
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
                  {isNaN(audio.current?.duration ?? NaN)
                    ? '--:--'
                    : getMinTime(audio.current?.duration ?? 0)}
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
    </GeneralProvider.Provider>
  )
}

function TitleScreen({ hymn }: { hymn: Hymn }) {
  return (
    <Screen>
      <h1 className='flex justify-center w-fit'>
        <p className='w-fit border-r-4 pr-2 border-current'>{hymn.number}</p>
        <p className='w-fit text-start pl-2'>{hymn.title}</p>
      </h1>
    </Screen>
  )
}

function Screen({ children }: React.PropsWithChildren) {
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

function Button({
  label,
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string
}) {
  const { mobile } = useContext(GeneralProvider)

  if (mobile || !label) {
    return (
      <div className='relative w-fit h-fit'>
        <button className={clsx(className)} {...props} aria-label={label} />
      </div>
    )
  }

  return <TooltipButton {...{ label, className, ...props }} />
}

function TooltipButton({
  label,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  label: string
}) {
  const [tooltipStyle, setTooltipStyle] = useState<{
    left?: string
    right?: string
  }>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const hover = useRef<boolean>(false)
  const { textColor } = useContext(GeneralProvider)

  const handleMouseOver = () => {
    if (!hover.current && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      const left = buttonRect.width / 2 - tooltipRect.width / 2

      const relativeLeft = buttonRect.left + left

      // Ajustes para no salir de la pantalla
      if (relativeLeft + tooltipRect.width + 8 > window.innerWidth) {
        setTooltipStyle({
          right: `0`,
        })
      } else if (relativeLeft >= 0) {
        setTooltipStyle({
          left: `${relativeLeft < 8 ? 8 - buttonRect.left : left}px`,
        })
      } else {
        setTooltipStyle({
          left: `0`,
        })
      }

      hover.current = true
    }
  }

  return (
    <div
      className={clsx('w-fit h-fit relative [&:hover>div]:block', className)}>
      <button
        ref={buttonRef}
        aria-label={label}
        {...props}
        onMouseOver={handleMouseOver}
        onMouseLeave={() => (hover.current = false)}
      />
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        role='tooltip'
        className={clsx(
          'absolute z-10 -top-full -translate-y-2 bg-backdrop border border-gray-200 p-base rounded-md text-nowrap',
          {
            hidden: true,
          },
          {
            'bg-white': textColor === TextColor.Black,
            'bg-black': textColor === TextColor.White,
          }
        )}>
        {label}
      </div>
    </div>
  )
}
