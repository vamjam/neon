import { TitleType } from '~/enums'
import {
  Credit,
  DataProvider,
  Library,
  Media,
  Nullable,
  Playlist,
  Tag,
} from '~/types'

export type Studio = {
  name: string
  originCountry?: Nullable<string>
  media: Media[]
}

export default interface Title {
  id: string
  createdAt: Date
  type: TitleType

  filePath: string
  fileCreatedAt?: Nullable<Date>
  fileModifiedAt?: Nullable<Date>

  name: string
  meta?: Nullable<string>
  search: string

  library: Library

  providers: DataProvider[]

  overview?: Nullable<string>
  tagline?: Nullable<string>
  releaseDate?: Nullable<Date>
  runtime?: Nullable<number>
  adult?: Nullable<boolean>

  media: Media[]
  tags: Tag[]
  studios: Studio[]
  playlists: Playlist[]
  credits: Credit[]
}
