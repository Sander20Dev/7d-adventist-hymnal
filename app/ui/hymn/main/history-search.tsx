'use client'

import { hymns } from '@/app/lib/hymns'
import { getHistoryOfHymnsStorage } from '@/app/lib/storage/history-of-hymns'
import { Hymn } from '@/app/lib/types'
import { useEffect, useState } from 'react'
import HymnSearch from '../../main/hymn-search'

export default function HistorySearch() {
  const [historyHymns, setHymns] = useState<Hymn[] | null>(null)

  useEffect(() => {
    setHymns(getHistoryOfHymnsStorage().map((number) => hymns[number - 1]))
  }, [])

  return <HymnSearch hymnsToSearch={historyHymns} />
}
