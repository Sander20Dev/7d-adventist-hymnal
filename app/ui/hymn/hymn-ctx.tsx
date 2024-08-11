'use client'

import { hymns } from '@/app/lib/hymns'
import { Hymn } from '@/app/lib/types'
import { createContext } from 'react'

export const HymnContext = createContext<Hymn>(hymns[0])

export default function HymnProvider({
  hymn,
  children,
}: React.PropsWithChildren<{ hymn: Hymn }>) {
  return <HymnContext.Provider value={hymn}>{children}</HymnContext.Provider>
}
