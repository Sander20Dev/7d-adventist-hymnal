import { Lyric } from '../../types'

export function prepareLyrics(lyrics: Lyric[], doubleChorus: boolean) {
  const chorus = lyrics.find((n) => n.type === 'chorus')
  const chorusIndex = lyrics.findIndex((n) => n.type === 'chorus')

  if (chorus) {
    return [
      ...(doubleChorus && chorusIndex > 0 ? [chorus] : []),
      ...lyrics.flatMap((lyric) => {
        if (lyric.type === 'stanza') {
          if (chorusIndex < 1) return [chorus, lyric]
          return [lyric, chorus]
        }
        return []
      }),
      ...(doubleChorus && chorusIndex < 1 ? [chorus] : []),
    ]
  }
  return lyrics
}
