'use client'

import { waitForKey } from '@/app/lib/hymn/player/keys'
import { useSearch } from '@/app/lib/hymn/search'
import { hymns } from '@/app/lib/hymns'
import { Hymn } from '@/app/lib/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SearchBarModal({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const [search, setSearch] = useState('')
  const [searched, setSearched] = useState<Hymn[]>([])
  useSearch(hymns, search, setSearched)

  useEffect(() => {
    const toogleSBKey = waitForKey({ key: 'k', ctrl: true }, () =>
      setOpen(!open)
    )
    const closeSBKey = waitForKey(
      { key: 'Escape' },
      () => open && setOpen(false)
    )

    const toogleSBWithKey = (ev: KeyboardEvent) => {
      toogleSBKey(ev)
      closeSBKey(ev)
    }
    window.addEventListener('keydown', toogleSBWithKey)
    return () => {
      window.removeEventListener('keydown', toogleSBWithKey)
    }
  }, [open])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-30'>
      <div
        className='w-full h-full backdrop-blur-sm'
        onClick={() => setOpen(false)}
      />
      <div className='absolute top-16 left-1/2 -translate-x-1/2 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-gray-50 rounded-md border border-gray-200 p-4 text-center text-black'>
        <input
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          className='w-full h-8 rounded-md bg-gray-50 border border-gray-200 p-base outline-gray-200'
          placeholder='Buscar...'
          autoFocus
        />
        <section className='absolute top-0 left-0 right-0 mt-16 p-2 bg-gray-50 rounded-md border border-gray-200 max-h-[calc(100vh-12rem)] overflow-y-auto'>
          {searched.map((hymn) => (
            <SearchedItem key={hymn.number + ':' + hymn.name} hymn={hymn} />
          ))}
        </section>
      </div>
    </div>
  )
}

function SearchedItem({ hymn }: { hymn: Hymn }) {
  return (
    <Link
      href={'/hymns/' + hymn.number + '/player'}
      className='flex flex-row gap-4 h-10 overflow-hidden border border-gray-50 rounded-md hover:bg-gray-100 hover:border-gray-200'>
      <div className='w-10 h-10 flex items-center text-end justify-end text-gray-500 text-lg'>
        {hymn.number}.
      </div>
      <div className='overflow-hidden flex items-center w-64'>
        <span className='text-gray-900 text-ellipsis text-nowrap overflow-hidden whitespace-nowrap'>
          {hymn.name}
        </span>
      </div>
    </Link>
  )
}
