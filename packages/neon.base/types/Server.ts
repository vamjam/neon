import { Library } from '~/types'

export default interface Server {
  id: string
  createdAt: Date
  name: string
  libraries: Library[]
}
