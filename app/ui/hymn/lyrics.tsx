import { Hymn, LyricKind } from '@/app/lib/types'

export default function Lyrics({ hymn }: { hymn: Hymn }) {
  return (
    <section className='flex flex-col gap-5 py-20 items-center text-center'>
      {hymn.lyrics.map((lyric, i) => (
        <section key={lyric.kind + i}>
          <p className='font-bold text-gray-900 underline decoration-wavy mb-2'>
            {lyric.kind === LyricKind.Verse
              ? `Estrofa ${
                  hymn.lyrics
                    .slice(0, i)
                    .some(({ kind: type }) => type === LyricKind.Chorus)
                    ? i
                    : i + 1
                }`
              : 'Coro'}
          </p>
          {lyric.lines.map((p) => (
            <p key={lyric.kind + i + p}>{p}</p>
          ))}
        </section>
      ))}
    </section>
  )
}
