import { MediaType } from '@shared/enums'
import { ArtEntity, Media, MediaEntity, MediaStreamEntity } from '@shared/types'
import config from '~/config'
import { date, id, url } from '~/maps'
import { ArtModel } from './art'
import { MediaStreamModel } from './media-stream'

export class MediaModel implements Omit<Media, 'streams'> {
  id: string
  parentId: string | null
  createdAt: Date
  lastUpdatedAt: Date | null
  importedAt: Date

  title: string | null
  mediaType: MediaType
  mimeType: string | null
  size: number | null
  width: number | null
  height: number | null
  container: string | null
  bitRate: number | null
  url: string

  streams: Omit<MediaStreamModel, 'mediaId'>[] | null
  art: Omit<ArtModel, 'mediaId'>[] | null

  fileURL: URL

  constructor(
    data: MediaEntity,
    art?: ArtEntity[],
    streams?: MediaStreamEntity[]
  ) {
    this.id = id.fromEntity(data.id) as string
    this.parentId = id.fromEntity(data.parentId)
    this.createdAt = date.fromEntity(data.createdAt) as Date
    this.lastUpdatedAt = date.fromEntity(data.lastUpdatedAt)
    this.importedAt = date.fromEntity(data.importedAt) as Date

    this.title = data.title
    this.mediaType = data.mediaType
    this.mimeType = data.mimeType
    this.size = data.size
    this.width = data.width
    this.height = data.height
    this.container = data.container
    this.bitRate = data.bitRate
    this.url = data.url

    this.art = art?.map((a) => new ArtModel(a)) ?? null
    this.streams = streams?.map((s) => new MediaStreamModel(s)) ?? null

    this.fileURL = url.fromEntity(this.url) as URL
  }

  toDTO(): Media {
    const { fileURL: _, ...copy } = this
    const apiURL = [config.get('api.url'), this.mediaType, this.id].join('/')

    return {
      ...copy,
      url: apiURL,
      streams: null,
    }
  }
}
