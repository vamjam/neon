import Art from './Art'

type MetaCommon = {
  art?: Art
  externalIds?: Record<string, string>
}

export type Video = MetaCommon & {
  budget?: number
  plot?: string
  releaseDate?: Date
  revenue?: number
  runtime?: number
  tagline?: string
}

export type Photo = MetaCommon & {
  aperture?: number
  camera?: string
  dateTaken?: Date
  description?: string
  flash?: boolean
  focalLength?: number
  iso?: number
  lens?: string
  location?: string
  shutterSpeed?: number
}

export type Audio = MetaCommon & {
  album?: string
  bitrate?: number
  channels?: number
  composer?: string
  description?: string
  discNumber?: number
  duration?: number
  genre?: string
  releaseDate?: Date
  sampleRate?: number
  trackNumber?: number
}

type Meta<T = Video | Photo | Audio> = Record<
  string,
  string | number | Date | boolean
> &
  T

export default Meta
