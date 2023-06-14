import format from 'string-template'
import { isNullOrEmpty } from '@shared/utils/string'
import config from '~/config'

const TOKENS = {
  APP_DATA: config.get('appData.url'),
  LIBRARY: config.get('library.url'),
}

export const fromEntity = (url: string | undefined | null) => {
  if (isNullOrEmpty(url)) {
    return undefined
  }

  const formatted = format(url, TOKENS)

  return new URL(formatted)
}

export const toEntity = (url: URL) => {
  const str = url.toString()

  return Object.entries(TOKENS).reduce((result, [key, value]) => {
    if (!isNullOrEmpty(value)) {
      return result.replace(value, `{${key}}`)
    }

    return result
  }, str)
}
