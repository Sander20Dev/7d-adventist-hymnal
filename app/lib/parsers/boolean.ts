export function booleanParser(str: string) {
  return str === 'true' ? true : str === 'false' ? false : null
}
