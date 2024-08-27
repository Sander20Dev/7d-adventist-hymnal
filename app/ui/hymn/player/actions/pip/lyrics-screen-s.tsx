import { Hymn, Lyric } from '@/app/lib/types'
import { Screen, TitleScreen } from '../../lyrics-screen'
import { useContext } from 'react'
import { AudioControllerCtx } from '../../provider'

export default function LyricsScreenS({
  hymn,
  lyrics,
}: {
  hymn: Hymn
  lyrics: Lyric[]
}) {
  const { index, played } = useContext(AudioControllerCtx)
  return (
    <div
      onClick={() => played.set(!played.current)}
      className='h-full max-h-full flex flex-row transition'
      style={{
        transform: `translateX(-${(index.current + 1) * 100}vw)`,
        height: 'calc(100vh - 4rem)',
      }}>
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
  )
}
