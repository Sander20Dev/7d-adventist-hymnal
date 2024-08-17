import { hymns } from '@/app/lib/hymns'
import { numberParser } from '@/app/lib/parsers/number'
import Back from '@/app/ui/hymn/back'
import Footer from '@/app/ui/hymn/footer'
import Header from '@/app/ui/hymn/header'
import Lyrics from '@/app/ui/hymn/lyrics'
import { notFound } from 'next/navigation'

export default function HymnPage({
  params: { hymn: rawHymnNumber },
}: {
  params: { hymn: string | string[] }
  searchParams: {}
}) {
  if (typeof rawHymnNumber !== 'string') notFound()
  const number = numberParser(rawHymnNumber)
  if (number == null) notFound()

  const hymn = hymns[number - 1]
  if (hymn == null) notFound()

  return (
    <main className='bg-gray-50 min-h-screen'>
      <Back number={hymn.number} />
      <Header hymn={hymn} />
      <Lyrics hymn={hymn} />
      <Footer hymn={hymn} />
    </main>
  )
}
