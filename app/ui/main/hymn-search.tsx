'use client'

import { hymns } from '@/app/lib/hymns'
import { Hymn } from '@/app/lib/types'
import { useState } from 'react'
import SearchBar from './search-bar'
import HymnsCatalog from './hymn-catalog'
import { IconLoader } from '@tabler/icons-react'

export default function HymnSearch({
  hymnsToSearch = hymns,
}: {
  hymnsToSearch?: Hymn[] | null
}) {
  if (hymnsToSearch == null) return <SearcherLoading />
  return <Searcher hymns={hymnsToSearch} />
}

function Searcher({ hymns }: { hymns: Hymn[] }) {
  const [searched, setSearched] = useState<Hymn[]>(hymns)
  return (
    <>
      <SearchBar hymns={hymns} setSearched={setSearched} />
      <HymnsCatalog hymns={searched} />
    </>
  )
}

function SearcherLoading() {
  return (
    <article className='flex justify-center items-center h-full min-h-40'>
      <IconLoader className='animate-spin-clockwise animate-iteration-count-infinite' />
    </article>
  )
}
