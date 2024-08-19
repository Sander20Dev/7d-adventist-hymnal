export type Props<T extends string> = {
  params: Record<T, string | string[] | undefined>
  searchParams: { [key: string]: string | string[] | undefined }
}
