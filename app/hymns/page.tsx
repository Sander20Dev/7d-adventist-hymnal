import { IconSearch } from '@tabler/icons-react'
import Link from 'next/link'
import HistorySearch from '../ui/hymn/main/history-search'
import { Metadata } from 'next'
import { relative_url, url_page } from '../lib/url'

export const metadata: Metadata = {
  metadataBase: new URL(url_page),
  title: 'Himnario Adventista - Historial',
  openGraph: {
    title: 'Himnario Adventista - Historial',
    images: relative_url('/images/full-images/thumbnail-21.webp'),
  },
}

export default function HistoryPage() {
  return (
    <main className='min-h-screen'>
      <header className='relative bg-[url(/images/full-images/thumbnail-21.webp)] bg-center bg-no-repeat bg-cover h-[60vh] max-h-96 grid place-content-center'>
        <div className='bg-white w-fit bg-backdrop rounded-lg p-3xl'>
          <h1 className='text-2xl md:text-4xl sm:text-3xl'>
            Himnario Adventista
          </h1>
        </div>

        <Link
          className='absolute right-2 top-2 rounded-full bg-backdrop bg-white border border-gray-200 h-10 w-10 flex justify-center items-center hover:bg-opacity-60'
          aria-label='Página Principal'
          href='/'>
          <IconSearch />
        </Link>
      </header>
      <HistorySearch />
    </main>
  )
}
