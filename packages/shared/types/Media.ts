import { type MediaType } from '../enums'
import Art from './Art'
import MediaStream from './MediaStream'

export type MediaEntity = {
  id: number
  parentId: number | null

  createdAt: number
  lastUpdatedAt: number | null
  importedAt: number

  url: string
  title: string | null
  mediaType: MediaType
  mimeType: string | null

  size: number | null
  width: number | null
  height: number | null
  container: string | null
  bitRate: number | null
}

type Media = Omit<
  MediaEntity,
  'id' | 'parentId' | 'createdAt' | 'lastUpdatedAt' | 'importedAt'
> & {
  id: string
  parentId: string | null
  createdAt: Date
  lastUpdatedAt: Date | null
  importedAt: Date
  art: Omit<Art, 'mediaId'>[] | null
  streams: Omit<MediaStream, 'mediaId'>[] | null
}

export default Media
