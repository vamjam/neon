import useSWR, { SWRConfiguration } from 'swr'

const fetcher = async <T>(url: string): Promise<T> => {
  const results = await fetch(url)
  const data = await results.json()

  return data
}

export const useAPIURL = () => {
  const location = new URL(window.location.href)

  return new URL([location.origin, 'api'].join('/'))
}

export default function useAPI<T>(pathname: string, config?: SWRConfiguration) {
  // const apiURL = useAPIURL()
  const { data, error } = useSWR<T, Error, string>(pathname, fetcher, config)

  const isLoading = !data && !error

  return {
    data,
    isLoading,
    error,
  }
}
