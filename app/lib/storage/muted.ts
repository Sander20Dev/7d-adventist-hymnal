import { booleanParser } from '../parsers/boolean'
import { Storage } from '../types'

export function setMutedStorage(muted: boolean) {
  localStorage.setItem(Storage.Muted, muted ? 'true' : 'false')
}

export function resetMutedStorage() {
  setMutedStorage(false)
  return false
}

export function getMutedStorage() {
  const muted = localStorage.getItem(Storage.Muted)

  if (muted == null) return resetMutedStorage()

  const number = booleanParser(muted)
  if (number == null) return resetMutedStorage()

  return number
}
