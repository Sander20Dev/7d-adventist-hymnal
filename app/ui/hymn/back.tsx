'use client'

import { IconChevronLeft } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'

export default function Back({
  className,
  href,
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href ?? '/'}
      className={clsx(
        'flex gap-2 rounded-full transition outline-none fixed top-2 left-2 z-20 p-2 bg-gray-50 hover:bg-opacity-75 border bg-backdrop border-gray-200',
        className
      )}>
      <IconChevronLeft />
    </Link>
  )
}
