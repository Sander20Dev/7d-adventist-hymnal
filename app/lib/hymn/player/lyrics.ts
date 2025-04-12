import { DividedLyric, Lyric } from '../../types'

export function prepareLyrics(
  lyrics: Lyric[],
  doubleChorus: boolean
): DividedLyric[] {
  const formattedLyrics = formatLyrics(lyrics, doubleChorus)
  const dividedLyrics = formattedLyrics.map(lyricDivider)
  return dividedLyrics
}

function lyricDivider(lyric: Lyric): DividedLyric {
  const MAX_LINES = 3
  const lines = lyric.lines

  const n = lines.length

  if (n <= MAX_LINES) {
    return {
      kind: lyric.kind,
      lines: [lines],
    }
  }

  const blocks = Math.ceil(n / MAX_LINES)
  const baseSize = Math.floor(n / blocks)
  let extra = n % blocks

  const result: string[][] = []
  let index = 0

  for (let i = 0; i < blocks; i++) {
    const size = baseSize + (extra > 0 ? 1 : 0)
    result.push(lines.slice(index, index + size))
    index += size
    if (extra > 0) extra--
  }

  return {
    kind: lyric.kind,
    lines: result,
  }
}

function formatLyrics(lyrics: Lyric[], doubleChorus: boolean): Lyric[] {
  const chorusPosition = lyrics.findIndex(({ kind }) => kind === 'chorus') as
    | 0
    | 1
    | -1

  if (chorusPosition === -1) return lyrics

  const newLength = (lyrics.length - 1) * 2
  const lyricsWithoutChorus = lyrics.filter(({ kind }) => kind !== 'chorus')

  const formattedLyrics = Array.from({ length: newLength }, (_, i) => {
    const isChorusIndex = i % 2 === chorusPosition

    if (isChorusIndex) {
      return lyrics[chorusPosition]
    } else {
      const index = Math.floor(i / 2)

      return lyricsWithoutChorus[index]
    }
  })

  if (doubleChorus) {
    if (chorusPosition === 1) {
      formattedLyrics.unshift(formattedLyrics[0])
    } else {
      formattedLyrics.push(formattedLyrics[0])
    }
  }

  // Filter chorus lines '[i]: line'
  const fixedLyrics = formattedLyrics.map((verse, i) => {
    if (verse.kind !== 'chorus') return verse

    const lines = verse.lines.flatMap((line) => {
      if (!line.startsWith('[')) return line

      const indexEnd = line.indexOf(']')

      if (indexEnd === -1) return line

      const chorusIndex =
        formattedLyrics.slice(0, i).filter((v) => v.kind === 'chorus').length +
        1

      if (/\[\d+\] /.test(line)) {
        // [index]: line
        const index = Number(line.slice(1, indexEnd))
        if (isNaN(index)) return []
        if (index < 1) return []
        return chorusIndex === index ? line.slice(indexEnd + 1) : []
      }

      if (/\[\d+\-\d+\] /.test(line)) {
        // [index-index]: line
        const indexRange = line.slice(1, indexEnd).split('-')
        if (indexRange.length !== 2) return []
        const indexRangeStart = Number(indexRange[0])
        const indexRangeEnd = Number(indexRange[1])
        if (isNaN(indexRangeStart) || isNaN(indexRangeEnd)) return []
        if (indexRangeStart < 1 || indexRangeEnd < 1) return []
        return chorusIndex >= indexRangeStart && chorusIndex <= indexRangeEnd
          ? line.slice(indexEnd + 1)
          : []
      }

      return []
    })

    return {
      ...verse,
      lines,
    }
  })

  return fixedLyrics
}
