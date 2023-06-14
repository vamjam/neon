import { Art, ArtEntity, ArtType } from '@shared/types'
import { date, id, url } from '~/maps'

export class ArtModel implements Art {
  public createdAt: Date
  public id: string
  public mediaId: string
  public type: ArtType
  public url: string

  constructor(data: ArtEntity) {
    this.createdAt = date.fromEntity(data.createdAt) as Date
    this.id = id.fromEntity(data.id) as string
    this.mediaId = id.fromEntity(data.mediaId) as string
    this.url = url.fromEntity(data.url)?.toString() as string
    this.type = data.type
  }
}
