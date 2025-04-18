import allThumbnails from './mocks/thumbnail.json'
import { Thumbnail } from './types'
import { relative_url } from './url'

export const thumbnails = allThumbnails as Thumbnail[]

export function getThumbnail(hymn: number) {
  return thumbnails.find(({ to }) => hymn <= to)
}

export function getThumbnailUrl(
  src: string,
  type: 'full-images' | 'thumbnails'
) {
  return relative_url(`/images/${type}/${src}.webp`)
}
