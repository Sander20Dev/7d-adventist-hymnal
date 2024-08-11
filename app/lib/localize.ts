export function localize(str: string) {
  return str
    .toLocaleLowerCase()
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ú', 'u')
    .replaceAll('à', 'a')
    .replaceAll('è', 'e')
    .replaceAll('ì', 'i')
    .replaceAll('ò', 'o')
    .replaceAll('ù', 'u')
    .replaceAll('ä', 'a')
    .replaceAll('ë', 'e')
    .replaceAll('ï', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
}

export function searchText(original: string, toSearch: string) {
  const indexOriginal = original
  const indexSearch = toSearch

  let lastIndex: number = 0

  for (let i = 0; i < indexSearch.length; i++) {
    const s = indexSearch[i]

    const index = indexOriginal.indexOf(s, lastIndex)

    if (index > -1) {
      lastIndex = index + 1
    } else {
      return false
    }
  }
  return true
}
