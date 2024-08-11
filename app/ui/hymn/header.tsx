import { getThumbnail } from '@/app/lib/thumbnail'
import { Hymn } from '@/app/lib/types'
import clsx from 'clsx'

export default function Header({ hymn }: { hymn: Hymn }) {
  const thumbnail = getThumbnail(hymn.number)!
  return (
    <header
      className={clsx(
        'bg-center bg-no-repeat bg-cover h-[60vh] max-h-96 flex flex-col gap-2 items-center justify-center',
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
        }
      )}
      style={{
        backgroundImage: 'url(/images/full-images/' + thumbnail.src + '.webp)',
      }}>
      <div className='bg-white w-fit bg-backdrop rounded-lg p-3xl'>
        <h1 className='text-3xl md:text-5xl sm:text-4xl'>
          Himno {hymn.number}
        </h1>
      </div>
      <div className='bg-white w-fit bg-backdrop rounded-lg p-2xl'>
        <h2 className='text-2xl md:text-4xl sm:text-3xl'>{hymn.title}</h2>
      </div>
    </header>
  )
}
