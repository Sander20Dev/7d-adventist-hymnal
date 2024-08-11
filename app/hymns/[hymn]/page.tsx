import { hymns } from '@/app/lib/hymns'
import Footer from '@/app/ui/hymn/footer'
import Header from '@/app/ui/hymn/header'
import HymnProvider from '@/app/ui/hymn/hymn-ctx'
import Lyrics from '@/app/ui/hymn/lyrics'
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

  return (
    <main className='bg-gray-50 min-h-screen'>
      <Header hymn={hymn} />
      <Lyrics hymn={hymn} />
      <Footer hymn={hymn} />
      <HymnProvider hymn={hymn}></HymnProvider>
    </main>
  )
}
