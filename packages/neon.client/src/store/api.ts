import { User } from '@neon/base/types'
import { WS_URL } from '~/config'

export const signup = async (data?: User) => {
  return request<User>('/auth/signup', data, 'POST')
}

export const login = async (username?: string, password?: string) => {
  return request<User>('/auth/login', { username, password }, 'POST')
}

const request = async <T>(
  url: string,
  data: {} = {},
  options: 'POST' | 'GET' | RequestInit = {
    method: 'GET',
    cache: 'no-cache',
  }
): Promise<T | undefined> => {
  const opts = typeof options === 'string' ? { method: options } : options
  const result = await fetch(`${WS_URL}${url}`, {
    ...opts,
    body: JSON.stringify(data),
  })

  if (!result.ok) {
    throw new Error('Request failed')
  }

  return result.json()
}
