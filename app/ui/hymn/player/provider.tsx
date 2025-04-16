import { TextColor } from '@/app/lib/types'
import { createContext } from 'react'

export const GeneralProvider = createContext({
  mobile: false,
  textColor: TextColor.Black,
})
