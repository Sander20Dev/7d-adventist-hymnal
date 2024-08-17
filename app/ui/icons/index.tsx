import { ThumbnailIcon } from '@/app/lib/types'
import {
  IconUsersGroup,
  IconCrossFilled,
  IconFlame,
  IconVocabulary,
  IconBuildingChurch,
} from '@tabler/icons-react'
import CrossHeard from './cross-heard'
import HomeHeard from './home-heard'
import RayLight from './ray-light'
import Trumpet from './trumpet'

export default function ThumbnailIcons({ icon }: { icon: ThumbnailIcon }) {
  if (icon === ThumbnailIcon.Group) return <IconUsersGroup />
  if (icon === ThumbnailIcon.RayLight) return <RayLight />
  if (icon === ThumbnailIcon.Cross) return <IconCrossFilled />
  if (icon === ThumbnailIcon.Flame) return <IconFlame />
  if (icon === ThumbnailIcon.Bible) return <IconVocabulary />
  if (icon === ThumbnailIcon.Trumpet) return <Trumpet />
  if (icon === ThumbnailIcon.CrossHeard) return <CrossHeard />
  if (icon === ThumbnailIcon.Church) return <IconBuildingChurch />
  if (icon === ThumbnailIcon.HomeHeard) return <HomeHeard />
  return <></>
}
