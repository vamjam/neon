type Page = {
  page: number
  count: number
}

export default Page

export type PagedResponse<T> = Page & {
  records: T[]
  total: number
}
