export type ArtType = 'poster' | 'backdrop' | 'logo' | 'banner' | 'thumbnail'

export type ArtEntity = {
  id: number
  createdAt: number
  mediaId: number
  url: string
  type: ArtType
}

type Art = Omit<ArtEntity, 'id' | 'mediaId' | 'createdAt'> & {
  id: string
  mediaId: string
  createdAt: Date
}

export default Art
