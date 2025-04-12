interface KeyOptions {
  key: string | string[]
  shift?: boolean
  ctrl?: boolean
  alt?: boolean
}

export function waitForKey(
  keyOptions: KeyOptions,
  callback: ((ev: KeyboardEvent) => any) | null | undefined
) {
  return (ev: KeyboardEvent) => {
    if (compareKeys(keyOptions, ev)) {
      ev.preventDefault()
      callback?.(ev)
    }
  }
}

function compareKeys(keyOptions: KeyOptions, ev: KeyboardEvent) {
  const { key, shift = false, ctrl = false, alt = false } = keyOptions

  if (typeof key === 'string') {
    if (key.toLowerCase() !== ev.key.toLowerCase()) return false
  } else if (!key.map((k) => k.toLowerCase()).includes(ev.key.toLowerCase())) {
    return false
  }
  if (shift !== ev.shiftKey) return false
  if (ctrl !== ev.ctrlKey) return false
  if (alt !== ev.altKey) return false

  return true
}
