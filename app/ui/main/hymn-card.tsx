import { getThumbnail } from '@/app/lib/thumbnail'
import { Hymn } from '@/app/lib/types'
import { IconAbc, IconPlayerPlayFilled } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'

export default function HymnCard(hymn: Hymn) {
  const thumbnail = getThumbnail(hymn.number)!

  return (
    <div className='animate-fade-in-up min-w-52 max-w-60 bg-white border border-gray-200 rounded-lg shadow'>
      <picture>
        <source
          srcSet={'/images/full-images/' + thumbnail.src + '.webp'}
          media='(min-width: 600px)'
        />
        <img
          className={clsx('rounded-t-lg aspect-video object-cover', {
            'object-center':
              thumbnail.orientation.x === 0 && thumbnail.orientation.y === 0,
            'object-left-top':
              thumbnail.orientation.x < 0 && thumbnail.orientation.y < 0,
            'object-right-top':
              thumbnail.orientation.x > 0 && thumbnail.orientation.y < 0,
            'object-left-bottom':
              thumbnail.orientation.x < 0 && thumbnail.orientation.y > 0,
            'object-right-bottom':
              thumbnail.orientation.x > 0 && thumbnail.orientation.y > 0,
          })}
          src={'/images/thumbnails/' + thumbnail.src + '.webp'}
          loading='lazy'
          alt={thumbnail.src}
          width={1024}
          height={576}
        />
      </picture>
      <span className='block p-4'>
        <h2 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
          Himno {hymn.number}
        </h2>
        <p className='mb-3 font-normal text-gray-700'>{hymn.name}</p>
        <div className='flex gap-2 flex-wrap'>
          <Link
            href={'/hymns/' + hymn.number}
            className='flex items-center justify-center px-4 py-2 gap-2 w-fit font-medium text-center text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-100 outline-none focus:border-gray-500'>
            <IconAbc /> Leer
          </Link>
          <Link
            href={'/hymns/' + hymn.number + '/player'}
            className='flex items-center justify-center px-4 py-2 gap-2 w-fit font-medium text-center text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-100 outline-none focus:border-gray-500'>
            <IconPlayerPlayFilled /> Reproducir
          </Link>
        </div>
      </span>
    </div>
  )
}
