import { arrayParser } from '../parsers/array'
import { Storage } from '../types'

export function setHistoryOfHymnsStorage(hymns: number[]) {
  const h = Array.from(new Set(hymns.filter((n) => 0 < n && n < 614)))

  localStorage.setItem(Storage.HistoryOfHymns, JSON.stringify(h))

  return h
}

export function resetHistoryOfHymnsStorage() {
  setHistoryOfHymnsStorage([])
  return []
}

export function getHistoryOfHymnsStorage() {
  const hymns = localStorage.getItem(Storage.HistoryOfHymns)

  if (hymns == null) return resetHistoryOfHymnsStorage()

  const number = arrayParser(hymns, 'number')
  if (number == null) return resetHistoryOfHymnsStorage()

  return number
}

export function addHistoryOfHymnsStorage(hymn: number) {
  return setHistoryOfHymnsStorage([hymn, ...getHistoryOfHymnsStorage()])
}
