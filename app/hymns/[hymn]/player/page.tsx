import { prepareLyrics } from '@/app/lib/hymn/player/lyrics'
import { hymns } from '@/app/lib/hymns'
import { Props } from '@/app/lib/nx'
import { numberParser } from '@/app/lib/parsers/number'
import { getThumbnail } from '@/app/lib/thumbnail'
import { TextColor } from '@/app/lib/types'
import LyricsScreen from '@/app/ui/hymn/player/lyrics-screen'
import clsx from 'clsx'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type HymnProps = Props<'hymn'>

export async function generateMetadata({
  params: { hymn: rawHymnNumber },
}: HymnProps): Promise<Metadata> {
  if (typeof rawHymnNumber !== 'string') notFound()
  const number = numberParser(rawHymnNumber)
  if (number == null) return {}

  const hymn = hymns[number - 1]
  if (hymn == null) return {}

  const thumbnail = getThumbnail(number)!

  const title =
    'Himno ' +
    number +
    ' - ' +
    hymn.name +
    ' - Reproductor - Himnario Adventista'

  return {
    metadataBase: new URL('https://7d-adventist-hymnal.vercel.app'),
    title,
    openGraph: {
      title,
      url:
        'https://7d-adventist-hymnal.vercel.app/hymns/' +
        hymn.number +
        '/player',
      type: 'website',
      images:
        'https://7d-adventist-hymnal.vercel.apphttps://7d-adventist-hymnal.vercel.app/images/full-images/' +
        thumbnail.src +
        '.webp',
      audio:
        'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-' +
        hymn.number +
        '.mp3',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images:
        'https://7d-adventist-hymnal.vercel.apphttps://7d-adventist-hymnal.vercel.app/images/full-images/' +
        thumbnail.src +
        '.webp',
    },
    icons:
      'https://7d-adventist-hymnal.vercel.app/icons/' + thumbnail.src + '.webp',
  }
}

export default function HymnPage({
  params: { hymn: rawHymnNumber },
}: HymnProps) {
  if (typeof rawHymnNumber !== 'string') notFound()

  const number = numberParser(rawHymnNumber)
  if (number == null) notFound()

  const hymn = hymns[number - 1]
  if (hymn == null) notFound()

  const thumbnail = getThumbnail(hymn.number)!
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
        lyrics={prepareLyrics(hymn.lyrics, hymn.doubleChorus ?? false)}
        hymn={hymn}
        thumbnail={thumbnail}
      />
    </main>
  )
}
