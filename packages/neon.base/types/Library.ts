import { LibraryType } from '~/enums'
import { Nullable, Title } from '~/types'
import BaseEntity from './BaseEntity'

export default class Library extends BaseEntity<Library> {
  createdAt!: Date
  name!: string
  path!: string
  type!: LibraryType
}

export class Playlist extends BaseEntity<Playlist> {
  createdAt!: Date
  name!: string
  titles!: Title[]
  rule!: Nullable<string>
}
