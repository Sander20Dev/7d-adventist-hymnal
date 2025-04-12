import { useEffect, useRef } from 'react'
import { Hymn } from '../types'
import { localize, searchText } from '../localize'

export function useSearch(
  hymns: Hymn[],
  search: string,
  setSearched: (value: Hymn[]) => void
) {
  const timer = useRef<number | null>(null)

  useEffect(() => {
    timer.current = window.setTimeout(() => {
      setSearched(
        hymns.filter((hymn) => {
          const title = localize(hymn.name)
          const text = localize(search)
          return (
            searchText(title, text) || searchText(`himno ${hymn.number}`, text)
          )
        })
      )
    }, 300)
    return () => {
      if (timer.current != null) {
        window.clearTimeout(timer.current)
        timer.current = null
      }
    }
  }, [search])
}
