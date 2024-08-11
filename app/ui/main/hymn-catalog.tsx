'use client'

import {
  IconArrowBadgeLeftFilled,
  IconArrowBadgeRightFilled,
} from '@tabler/icons-react'
import HymnCard from './hymn-card'
import { HymnSearch } from './hymn-search'
import { useContext, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'

export default function HymnsCatalog() {
  const { searched } = useContext(HymnSearch)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (page * 45 > searched.length) {
      setPage(Math.ceil(searched.length / 45) - 1)
    }
  }, [searched])
  const maxPage = useMemo(() => {
    return Math.ceil(searched.length / 45) - 1
  }, [searched])

  return (
    <>
      <article className='flex gap-4 p-4 flex-wrap justify-center'>
        {searched.slice(page * 45, (page + 1) * 45).map((hymn) => (
          <HymnCard key={'hymn-' + hymn.number} {...hymn} />
        ))}
      </article>
      <div className='fixed bottom-2 flex items-center bg-gray-50 border border-gray-200 bg-backdrop text-lg p-base rounded-md left-1/2 -translate-x-1/2'>
        <button
          className={clsx('text-gray-900 disabled:text-gray-900/50', {
            'hover:-translate-x-0.5 transition': page > 0,
          })}
          disabled={page < 1}
          onClick={() => setPage(page - 1)}>
          <IconArrowBadgeLeftFilled />
        </button>
        <span>
          {page + 1} / {maxPage + 1}
        </span>
        <button
          className={clsx('text-gray-900 disabled:text-gray-900/50', {
            'hover:translate-x-0.5 transition': page < maxPage,
          })}
          disabled={page > maxPage - 1}
          onClick={() => setPage(page + 1)}>
          <IconArrowBadgeRightFilled />
        </button>
      </div>
    </>
  )
}
