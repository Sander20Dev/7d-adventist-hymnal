export interface Hymn {
  number: number
  title: string
  steps?: number[]
  lyrics: Lyric[]
  verse?: string
  doubleChorus?: boolean
}

export interface Lyric {
  type: LyricType
  verses: string[]
  index?: number
}

export enum LyricType {
  Chorus = 'chorus',
  Stanza = 'stanza',
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
  LastHymns = 'player.last_hymns',
}
