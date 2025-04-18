'use client'

import { DividedLyric, Hymn, TextColor, Thumbnail } from '@/app/lib/types'
import clsx from 'clsx'
import Back from '../../back'
import ThumbnailIcons from '../../../icons'
import { useAudio } from '@/app/lib/hymn/player/audio'
import { useState } from 'react'
import SearchBarModal from '../search-bar-modal'
import PlayBtn from '../actions/play-btn'
import PrevBtn from '../actions/prev-btn'
import NextBtn from '../actions/next-btn'
import MuteBtn from '../actions/mute-btn'
import VolumeRng from '../actions/volume-rng'
import FullscreenBtn from '../actions/fullscreen-btn'
import TimeRng from '../actions/time-rng'
import PosDurSpan from '../actions/pos-dur-span'
import ScreensIndex from '../screens-index'

export default function LyricsScreen({
  lyrics,
  hymn,
  thumbnail,
  audio,
}: {
  lyrics: DividedLyric[]
  hymn: Hymn
  thumbnail: Thumbnail
  audio: HTMLAudioElement
}) {
  const [open, setOpen] = useState(false)

  const {
    index,
    focused,
    activeFocus,
    handleFullscreen,
    handlePlay,
    goPrev,
    goNext,
  } = useAudio(audio, hymn, lyrics)

  return (
    <>
      <SearchBarModal open={open} setOpen={setOpen} />
      <div className='h-dvh grid select-none'>
        <Back
          href={'/hymns/' + hymn.number}
          className={clsx('transition', {
            '-top-full scale-0': !focused,
          })}
        />
        <ScreensIndex
          onClick={handlePlay}
          onDoubleClick={handleFullscreen}
          index={index}
          thumbnail={thumbnail}
          hymn={hymn}
          lyrics={lyrics}
        />
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
              <TimeRng
                audio={audio}
                keysBlocked={open}
                activeFocus={activeFocus}
              />
            </section>
            <section className='flex flex-row gap-2 justify-between [&_section]:flex [&_section]:flex-row [&_section]:gap-2 [&_section]:items-center [&_button:hover]:scale-105'>
              <section>
                <PrevBtn
                  goPrev={goPrev}
                  keysBlocked={open}
                  activeFocus={activeFocus}
                />
                <PlayBtn
                  audio={audio}
                  keysBlocked={open}
                  activeFocus={activeFocus}
                />
                <NextBtn
                  goNext={goNext}
                  keysBlocked={open}
                  activeFocus={activeFocus}
                />
                <MuteBtn
                  audio={audio}
                  keysBlocked={open}
                  activeFocus={activeFocus}
                />
                <VolumeRng
                  audio={audio}
                  keysBlocked={open}
                  activeFocus={activeFocus}
                />
              </section>
              <section>
                <PosDurSpan audio={audio} />
                <FullscreenBtn keysBlocked={open} activeFocus={activeFocus} />
              </section>
            </section>
          </section>
        </div>
      </div>
    </>
  )
}
