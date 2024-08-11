import allThumbnails from './mocks/thumbnail.json'
import { Thumbnail } from './types'

export const thumbnails = allThumbnails as Thumbnail[]

export function getThumbnail(hymn: number) {
  return thumbnails.find(({ to }) => hymn <= to)
}
