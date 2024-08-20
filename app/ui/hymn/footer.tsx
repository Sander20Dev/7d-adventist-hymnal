'use client'

import { Hymn, TrackType } from '@/app/lib/types'
import IconButton from '../utils/icon-button'
import {
  IconMusic,
  IconPlayerPlayFilled,
  IconUsersGroup,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'
import Player from './player'
import clsx from 'clsx'

export default function Footer({ hymn }: { hymn: Hymn }) {
  const [type, setType] = useState<TrackType>()

  return (
    <>
      <footer className='flex justify-center gap-4 p-4'>
        <IconButton
          className={clsx({
            'bg-gray-400 hover:bg-gray-500': type === TrackType.INSTRUMENTAL,
          })}
          onClick={() =>
            setType(
              type === TrackType.INSTRUMENTAL
                ? undefined
                : TrackType.INSTRUMENTAL
            )
          }>
          <IconMusic />
        </IconButton>
        <IconButton
          className={clsx({
            'bg-gray-400 hover:bg-gray-500': type === TrackType.VOCAL,
          })}
          onClick={() =>
            setType(type === TrackType.VOCAL ? undefined : TrackType.VOCAL)
          }>
          <IconUsersGroup />
        </IconButton>
        <Link
          href={'/hymns/' + hymn.number + '/player'}
          className='flex gap-2 rounded-full p-4 transition outline-none bg-gray-200 hover:bg-gray-300 w-fit'>
          Reproductor <IconPlayerPlayFilled />
        </Link>
      </footer>
      <Player hymn={hymn} type={type} />
    </>
  )
}
