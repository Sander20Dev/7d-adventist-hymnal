'use client'
import { hymns } from '@/app/lib/hymns'
import { Hymn } from '@/app/lib/types'
import { createContext, useState } from 'react'

export const HymnSearch = createContext<{
  searched: Hymn[]
  setSearched(searched: Hymn[]): void
}>({
  searched: [],
  setSearched() {},
})

export default function HymnSearchProvider({
  children,
}: React.PropsWithChildren) {
  const [searched, setSearched] = useState<Hymn[]>(hymns)
  return (
    <HymnSearch.Provider value={{ searched, setSearched }}>
      {children}
    </HymnSearch.Provider>
  )
}
