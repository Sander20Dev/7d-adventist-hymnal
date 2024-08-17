import { numberParser } from '../parsers/number'
import { Storage } from '../types'

export function setVolumeStorage(volume: number) {
  localStorage.setItem(Storage.Volume, volume.toString())
}
export function resetVolumeStorage() {
  localStorage.setItem(Storage.Volume, '100')
  return 100
}

export function getVolumeStorage() {
  const volume = localStorage.getItem(Storage.Volume)

  if (volume == null) return resetVolumeStorage()

  if (volume.includes('.')) return resetVolumeStorage()
  if (volume.includes(',')) return resetVolumeStorage()

  const number = numberParser(volume)
  if (number == null) return resetVolumeStorage()

  if (number > 100 || number < 0) return resetVolumeStorage()

  return number
}
