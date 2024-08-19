import { getThumbnail } from '@/app/lib/thumbnail'
import { Hymn } from '@/app/lib/types'
import clsx from 'clsx'
import Link from 'next/link'

export default function HymnCard(hymn: Hymn) {
  const thumbnail = getThumbnail(hymn.number)!

  return (
    <Link href={'/hymns/' + hymn.number}>
      <div className='min-w-52 max-w-60 bg-white border border-gray-200 rounded-lg shadow transition hover:scale-105'>
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
        <div className='p-4'>
          <h2 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
            Himno {hymn.number}
          </h2>
          <p className='mb-3 font-normal text-gray-700'>{hymn.title}</p>
        </div>
      </div>
    </Link>
  )
}
