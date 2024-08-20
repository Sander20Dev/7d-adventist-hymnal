interface TypeOf {
  string: string
  number: number
  boolean: boolean
}

type T<K> = K extends keyof TypeOf ? TypeOf[K][] : any[]

export function arrayParser<K extends keyof TypeOf | undefined>(
  str: string,
  type?: K
): T<K> | null {
  try {
    const arr = JSON.parse(str)
    if (!Array.isArray(arr)) return null

    if (type == null) return arr as T<K>
    if (arr.some((t) => typeof t !== type)) return null
    return arr as T<K>
  } catch {
    return null
  }
}
