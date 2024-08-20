import { IconHistory } from '@tabler/icons-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className='relative bg-[url(/images/full-images/thumbnail-21.webp)] bg-center bg-no-repeat bg-cover h-[60vh] max-h-96 grid place-content-center'>
      <div className='bg-white w-fit bg-backdrop rounded-lg p-3xl'>
        <h1 className='text-2xl md:text-4xl sm:text-3xl'>
          Himnario Adventista
        </h1>
      </div>

      <Link
        className='absolute right-2 top-2 rounded-full bg-backdrop bg-white border border-gray-200 h-10 w-10 flex justify-center items-center hover:bg-opacity-60'
        aria-label='Historial'
        href='/hymns'>
        <IconHistory />
      </Link>
    </header>
  )
}
