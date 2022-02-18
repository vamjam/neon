import { MediaType } from '~/enums'

export default interface Media {
  createdAt: Date
  type: MediaType
  uri: string
}
