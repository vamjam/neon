import Hashids from 'hashids'
import { isNullOrEmpty } from '@shared/utils/string'

const hashids = new Hashids('neon', 6, 'abcdefghijklmnopqrstuvwxyz')

export const toEntity = (id: string | undefined | null) => {
  if (isNullOrEmpty(id)) {
    return null
  }

  return hashids.decode(id)[0] as number
}

export const fromEntity = (id: number | undefined | null) => {
  if (!Number.isFinite(id)) {
    return null
  }

  return hashids.encode(id as number)
}
