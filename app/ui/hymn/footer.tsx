import { Hymn } from '@/app/lib/types'
import IconButton from '../utils/icon-button'
import { IconMusic, IconPlayerPlay, IconUsersGroup } from '@tabler/icons-react'

export default function Footer({ hymn }: { hymn: Hymn }) {
  return (
    <footer>
      <IconButton>
        <IconMusic />
      </IconButton>
      <IconButton>
        <IconUsersGroup />
      </IconButton>
      <IconButton>
        Reproducir <IconPlayerPlay />
      </IconButton>
    </footer>
  )
}
