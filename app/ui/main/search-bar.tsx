'use client'

import { useEffect, useRef, useState } from 'react'
import { localize, searchText } from '@/app/lib/localize'
import { Hymn } from '@/app/lib/types'

export default function SearchBar({
  hymns,
  setSearched,
}: {
  hymns: Hymn[]
  setSearched(value: Hymn[]): void
}) {
  const [search, setSearch] = useState('')
  const timer = useRef<number | null>(null)

  useEffect(() => {
    timer.current = window.setTimeout(() => {
      setSearched(
        hymns.filter((hymn) => {
          const title = localize(hymn.title)
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

  return (
    <div className='sticky top-0 z-10 w-full h-16 p-4 bg-gray-50 bg-backdrop border-b border-gray-200'>
      <input
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
        className='w-full h-full rounded-md bg-gray-50 border border-gray-200 p-base outline-gray-200'
        placeholder='Buscar...'
      />
    </div>
  )
}
