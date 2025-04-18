export const url_page = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

export function relative_url(path: string) {
  return url_page + path
}
