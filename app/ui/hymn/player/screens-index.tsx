import { DividedLyric, Hymn, TextColor, Thumbnail } from '@/app/lib/types'
import clsx from 'clsx'

interface ScreensIndexProps {
  onClick?: () => void
  onDoubleClick?: () => void
  index: number
  thumbnail: Thumbnail
  hymn: Hymn
  lyrics: DividedLyric[]
}

export default function ScreensIndex({
  onClick,
  onDoubleClick,
  index,
  thumbnail,
  hymn,
  lyrics,
}: ScreensIndexProps) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className='h-dvh max-h-dvh flex flex-row transition'
      style={{ transform: `translateX(-${(index + 1) * 100}vw)` }}>
      <TitleScreen hymn={hymn} textColor={thumbnail.textColor} />
      {lyrics.map((lyric, i) =>
        lyric.lines.map((lines, j) => (
          <Screen
            key={'lyric-' + i + ':verse-' + j}
            textColor={thumbnail.textColor}>
            {lines.map((line, k) => (
              <p key={'lyric-' + i + ':verse-' + j + ':' + k}>{line}</p>
            ))}
          </Screen>
        ))
      )}
      <TitleScreen hymn={hymn} textColor={thumbnail.textColor} />
    </div>
  )
}

function TitleScreen({
  hymn,
  textColor,
}: {
  hymn: Hymn
  textColor: TextColor
}) {
  return (
    <Screen textColor={textColor}>
      <h1 className='flex justify-center items-center w-fit [font-size:inherit] [line-height:inherit]'>
        <p className='w-fit border-r-4 pr-2 border-current'>{hymn.number}</p>
        <p className='w-fit text-start pl-2'>{hymn.name}</p>
      </h1>
    </Screen>
  )
}

function Screen({
  textColor,
  children,
}: React.PropsWithChildren<{ textColor: TextColor }>) {
  return (
    <section className='flex flex-col justify-center items-center w-screen h-full p-4 text-xl sm:text-3xl md:text-4xl xl:text-5xl'>
      <div
        className={clsx(
          'bg-backdrop p-xl sm:p-2xl md:p-3xl rounded-md text-center',
          {
            'bg-white': textColor === TextColor.Black,
            'bg-black': textColor === TextColor.White,
          }
        )}>
        {children}
      </div>
    </section>
  )
}
