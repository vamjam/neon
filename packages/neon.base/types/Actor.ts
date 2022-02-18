import { Gender } from '~/enums'
import { DataProvider, Media, Nullable, Tag, Title } from '~/types'

export type Credit = {
  id: string
  title: Title
  actor: Actor
  name?: Nullable<string>
  department?: Nullable<string>
  job?: Nullable<string>
}

export default interface Actor {
  id: string
  createdAt: Date
  providers: DataProvider[]
  adult?: Nullable<boolean>
  gender: Gender
  name: string
  search: string
  bio?: Nullable<string>
  credits: Credit[]
  media: Media[]
  tags: Tag[]
}
