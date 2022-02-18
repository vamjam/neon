import { QueryClient, QueryFunction } from 'react-query'
import { WS_URL } from '~/config'

const defaultQuery: QueryFunction<
  unknown,
  readonly unknown[] | string | [url: string, opts?: RequestInit]
> = async ({ queryKey }) => {
  if (typeof queryKey !== 'string' && !Array.isArray(queryKey)) {
    throw new Error('Invalid URL')
  }

  const [url, opts] = typeof queryKey === 'string' ? [queryKey] : queryKey
  const resp = await fetch(`${WS_URL}${url}`, opts)

  if (!resp.ok) {
    throw new Error('Request failed')
  }

  return resp.json()
}

export default new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQuery,
    },
  },
})
