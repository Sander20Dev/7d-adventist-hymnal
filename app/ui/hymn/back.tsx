'use client'

import { IconChevronLeft } from '@tabler/icons-react'
import IconButton from '../utils/icon-button'
import { useRouter } from 'next/navigation'

export default function Back({ number }: { number: number }) {
  const router = useRouter()

  return (
    <IconButton
      className='fixed top-2 left-2 p-2 bg-gray-50 hover:bg-gray-100 border bg-backdrop border-gray-200'
      onClick={() => router.back()}>
      <IconChevronLeft />
    </IconButton>
  )
}
