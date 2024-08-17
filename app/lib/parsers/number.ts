export function numberParser(str: string) {
  const number = +str
  if (isNaN(number)) return null
  if (!isFinite(number)) return null
  if (str !== number.toString()) return null

  return number
}
