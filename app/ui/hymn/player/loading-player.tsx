import { TextColor, Thumbnail } from '@/app/lib/types'
import clsx from 'clsx'

export default function LoadingPlayer({ thumbnail }: { thumbnail: Thumbnail }) {
  return (
    <div
      className={clsx(
        'h-dvh overflow-hidden bg-no-repeat bg-cover',
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
          'text-white bg-black [&_input]:accent-white':
            thumbnail.textColor === TextColor.White,
          'text-black bg-white [&_input]:accent-black':
            thumbnail.textColor === TextColor.Black,
        },
        'flex justify-center items-center'
      )}>
      <div
        className='rounded-full w-16 h-16 animate-spin border-4 border-current border-t-transparent'
        style={{ color: thumbnail.textColor }}></div>
    </div>
  )
}
