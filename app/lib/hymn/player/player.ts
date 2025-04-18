import { useEffect, useRef, useState } from 'react'
import { waitForKey } from './keys'

export function useFocus() {
  const [focused, setFocused] = useState(true)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const activeFocusWithMouse = () => {
      activeFocus()
    }

    const activeFocusKey = waitForKey({ key: '.' }, toogleFocus)

    const activeFocusWithKey = (ev: KeyboardEvent) => {
      activeFocusKey(ev)
    }

    window.addEventListener('keydown', activeFocusWithKey)
    window.addEventListener('mousemove', activeFocusWithMouse)

    return () => {
      window.removeEventListener('keydown', activeFocusWithKey)
      window.removeEventListener('mousemove', activeFocusWithMouse)
    }
  })

  const activeFocus = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }

    setFocused(true)

    timer.current = window.setTimeout(() => {
      setFocused(false)
    }, 5000)
  }

  const toogleFocus = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }

    if (!focused) {
      activeFocus()
    } else {
      setFocused(false)
    }
  }

  return { focused, activeFocus, toogleFocus }
}
