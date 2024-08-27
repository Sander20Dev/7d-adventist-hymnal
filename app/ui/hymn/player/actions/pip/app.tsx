import { useAudio } from '@/app/lib/hymn/player/audio'
import { AudioControllerCtx, type AudioController } from '../../provider'
import { Hymn, Lyric, TextColor } from '@/app/lib/types'
import LyricsScreenS from './lyrics-screen-s'
import { getThumbnail } from '@/app/lib/thumbnail'
import clsx from 'clsx'
import Controls from './controls'

export default function PipApp({
  audio,
  hymn,
  lyrics,
}: {
  audio: HTMLAudioElement
  hymn: Hymn
  lyrics: Lyric[]
}) {
  const { audioCtllr } = useAudio(hymn, lyrics)

  const thumbnail = getThumbnail(hymn.number)!
  return (
    <AudioControllerCtx.Provider value={audioCtllr}>
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
        <div className='w-full h-full grid grid-rows-[1fr_auto] select-none'>
          <LyricsScreenS hymn={hymn} lyrics={lyrics} />
          <Controls />
        </div>
      </main>
    </AudioControllerCtx.Provider>
  )
}
