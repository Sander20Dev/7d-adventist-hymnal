import { hymns } from '@/app/lib/hymns'
import { Props } from '@/app/lib/nx'
import { numberParser } from '@/app/lib/parsers/number'
import { getThumbnail } from '@/app/lib/thumbnail'
import { relative_url, url_page } from '@/app/lib/url'
import Back from '@/app/ui/hymn/back'
import Footer from '@/app/ui/hymn/footer'
import Header from '@/app/ui/hymn/header'
import Lyrics from '@/app/ui/hymn/lyrics'
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

  const title = 'Himno ' + number + ' - ' + hymn.name + ' - Himnario Adventista'

  return {
    metadataBase: new URL(url_page),
    title,
    openGraph: {
      title,
      url: relative_url('/hymns/' + hymn.number + '/player'),
      type: 'website',
      images: relative_url('/images/thumbnails/' + thumbnail.src + '.webp'),
      audio: [
        'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/track/hymn-' +
          hymn.number +
          '.mp3',
        'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-' +
          hymn.number +
          '.mp3',
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: relative_url('/images/thumbnails/' + thumbnail.src + '.webp'),
    },
    icons: relative_url('/icons/' + thumbnail.src + '.webp'),
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

  return (
    <main className='bg-gray-50 min-h-screen'>
      <Back />
      <Header hymn={hymn} />
      <Lyrics hymn={hymn} />
      <Footer hymn={hymn} />
    </main>
  )
}
