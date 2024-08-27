import { TextColor } from '@/app/lib/types'
import { createContext } from 'react'

export const GeneralProvider = createContext({
  mobile: false,
  textColor: TextColor.Black,
})

type Thing<T> = { current: T; set(val: T): void }
export interface AudioController {
  audio: HTMLAudioElement | null
  played: Thing<boolean>
  volume: Thing<number>
  muted: Thing<boolean>
  time: Thing<number>
  index: Thing<number>
}
export const AudioControllerCtx = createContext<AudioController>({
  audio: null,
  played: { current: false, set() {} },
  volume: { current: 0, set() {} },
  muted: { current: false, set() {} },
  time: { current: 0, set() {} },
  index: { current: 0, set() {} },
})
