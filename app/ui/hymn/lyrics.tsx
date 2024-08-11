import { Hymn } from '@/app/lib/types'

export default function Lyrics({ hymn }: { hymn: Hymn }) {
  return (
    <section className='flex flex-col gap-5 py-20 items-center text-center'>
      {hymn.lyrics.map((lyric, i) => (
        <section key={lyric.type + i}>
          <p className='font-bold text-gray-900 underline decoration-wavy mb-2'>
            {lyric.type === 'stanza' ? `Estrofa ${lyric.index}` : 'Coro'}
          </p>
          {lyric.verses.map((p) => (
            <p key={lyric.type + i + p}>{p}</p>
          ))}
        </section>
      ))}
    </section>
  )
}
