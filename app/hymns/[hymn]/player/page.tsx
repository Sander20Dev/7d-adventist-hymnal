import { prepareLyrics } from '@/app/lib/hymn/player/lyrics'
import { hymns } from '@/app/lib/hymns'
import { getThumbnail } from '@/app/lib/thumbnail'
import { TextColor } from '@/app/lib/types'
import LyricsScreen from '@/app/ui/hymn/player/lyrics-screen'
import clsx from 'clsx'
import { notFound } from 'next/navigation'

export default function HymnPage({
  params: { hymn: rawHymnNumber },
}: {
  params: { hymn: string | string[] }
  searchParams: {}
}) {
  if (typeof rawHymnNumber !== 'string') notFound()
  const number = +rawHymnNumber
  if (isNaN(number)) notFound()
  if (rawHymnNumber !== number.toString()) notFound()

  const hymn = hymns[number - 1]
  if (hymn == null) notFound()

  const thumbnail = getThumbnail(hymn.number)!
  return (
    <main
      className={clsx(
        'bg-gray-50 h-screen overflow-hidden bg-no-repeat bg-cover',
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
        backgroundImage: `url(/images/full-images/${thumbnail.src}.webp)`,
      }}>
      <LyricsScreen
        lyrics={prepareLyrics(hymn.lyrics, hymn.doubleChorus ?? false)}
        hymn={hymn}
        thumbnail={thumbnail}
      />
    </main>
  )
}
