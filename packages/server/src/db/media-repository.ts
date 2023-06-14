import { MediaType, MediaTypes } from '@shared/enums'
import { ArtEntity, MediaEntity, MediaStreamEntity, Page } from '@shared/types'
import { date } from '~/maps'
import repository from './repository'

class MediaRepository extends repository<MediaEntity>('media') {
  async create(
    data: Omit<
      MediaEntity,
      'id' | 'createdAt' | 'importedAt' | 'lastUpdatedAt'
    >,
    art?: Omit<ArtEntity, 'id' | 'mediaId'>[] | null,
    streams?: Omit<MediaStreamEntity, 'id' | 'mediaId'>[] | null
  ) {
    const now = date.toEntity(new Date()) as number
    const entity: Omit<MediaEntity, 'id'> = {
      ...data,
      createdAt: now,
      lastUpdatedAt: null,
      importedAt: now,
    }

    const [result] = await this.client.insert(entity, 'id')

    if (art) {
      await this.getTable<ArtEntity>('art').insert(
        art.map((a) => ({ ...a, mediaId: result.id }))
      )
    }

    if (streams) {
      await this.getTable<MediaStreamEntity>('media_streams').insert(
        streams.map((s) => ({ ...s, mediaId: result.id }))
      )
    }

    return result.id
  }

  async getPagedByType(mediaType: MediaType, pageParam: Page) {
    const { page, count } = pageParam
    const query = this.client.where({ mediaType })
    const totalQuery = Object.entries(
      await query.clone().count<Record<string, number>>()
    )[0][1]
    const total = Object.values(totalQuery)[0]
    const actualPage = page - 1
    const offset = actualPage * count
    const records = await query.offset(offset).limit(count)

    return {
      page,
      count,
      total,
      records,
    }
  }

  async getMediaById(id: number) {
    const [record] = await this.client.where({ id })

    return record
  }

  getMediaByParentId(parentId: number | null) {
    return this.client.where({ parentId })
  }

  getMediaAsStream(...columns: (keyof MediaEntity)[]) {
    return this.client.select(columns).stream()
  }

  async deleteMedia(id: number) {
    const [record] = await this.client.where({ id })

    if (record.mediaType === MediaTypes.Folder) {
      await this.client.where({ parentId: id }).del()
    }

    await this.getTable('media_streams').where({ mediaId: id }).del()
    await this.getTable('art').where({ mediaId: id }).del()

    return this.client.where({ id }).del()
  }
}

export default new MediaRepository()
