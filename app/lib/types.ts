export interface Hymn {
  number: number
  name: string
  timestamps: number[]
  /** @deprecated Use timestamps instead */
  steps?: number[]
  lyrics: Lyric[]
  verseAssociated?: string | null
  doubleChorus: boolean
}

export interface Lyric {
  kind: LyricKind
  lines: string[]
}

export enum LyricKind {
  Chorus = 'chorus',
  Verse = 'verse',
}

export interface DividedLyric {
  kind: LyricKind
  lines: string[][]
}

export interface Thumbnail {
  from: number
  to: number
  textColor: TextColor
  src: string
  orientation: Orientation
  icon: ThumbnailIcon
}

export interface Orientation {
  x: number
  y: number
}

export enum TextColor {
  Black = 'black',
  White = 'white',
}

export enum ThumbnailIcon {
  Group = 'group',
  RayLight = 'ray-light',
  Cross = 'cross',
  Flame = 'flame',
  Bible = 'bible',
  Trumpet = 'trumpet',
  CrossHeard = 'cross-heard',
  Church = 'church',
  HomeHeard = 'home-heard',
}

export enum Storage {
  Volume = 'player.volume',
  Muted = 'player.mute',
  HistoryOfHymns = 'player.history-of-hymns',
}

export enum TrackType {
  VOCAL = 'sung',
  INSTRUMENTAL = 'track',
}
