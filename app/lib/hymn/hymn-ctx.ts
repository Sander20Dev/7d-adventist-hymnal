'use client'
import { HymnContext } from '@/app/ui/hymn/hymn-ctx'
import { useContext } from 'react'

export function useHymn() {
  return useContext(HymnContext)
}
