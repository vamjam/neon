import Ffmpeg from 'fluent-ffmpeg'
import { MediaStream, MediaStreamEntity } from '@shared/types'
import { isNullOrEmpty } from '@shared/utils/string'
import { id as idMap } from '~/maps'

const isNumber = (val?: unknown): val is number => {
  const num = toNumber(val)

  return Number.isFinite(num)
}

const toNumber = (val?: unknown) => {
  if (typeof val === 'string' && isNullOrEmpty(val)) {
    return undefined
  }

  const num = Number(val)

  if (Number.isFinite(num)) {
    return num
  }
}

const parseDivString = (str: string | null | undefined) => {
  if (isNullOrEmpty(str)) {
    return undefined
  }

  const [top, bottom] = str.split('/')
  const dividend = toNumber(top)
  const divisor = toNumber(bottom)

  if (dividend != null && divisor != null) {
    return toNumber((dividend / divisor).toFixed(2))
  }
}

const parseAspectRatio = (val?: string) => {
  if (isNullOrEmpty(val)) {
    return undefined
  }

  const parts = val.split(':')

  if (parts.length !== 2) {
    return undefined
  }

  const u = isNumber(parts.at(0))
  const d = isNumber(parts.at(1))

  if (!u || !d) {
    return undefined
  }

  return val
}

export type FfprobeStreamWithCodec = Ffmpeg.FfprobeStream & {
  codec_name: string
}

export class MediaStreamModel implements Omit<MediaStream, 'id' | 'mediaId'> {
  id: string | null
  mediaId: string | null

  aspectRatio: string | null
  channelLayout: string | null
  channels: number | null
  codec: string
  frameRate: number | null
  height: number | null
  index: number
  lang: string | null
  level: number | null
  pixelFormat: string | null
  profile: string | null
  sampleRate: number | null
  timeBase: string | null
  type: 'video' | 'audio'
  width: number | null

  constructor(
    data: Omit<MediaStreamEntity, 'id' | 'mediaId'>,
    id?: number | null,
    mediaId?: number | null
  ) {
    this.id = id ? idMap.fromEntity(id) : null
    this.mediaId = mediaId ? idMap.fromEntity(mediaId) : null

    this.aspectRatio = data.aspectRatio
    this.channelLayout = data.channelLayout
    this.channels = data.channels
    this.codec = data.codec
    this.frameRate = data.frameRate
    this.height = data.height
    this.index = data.index
    this.lang = data.lang
    this.level = data.level
    this.pixelFormat = data.pixelFormat
    this.profile = data.profile
    this.sampleRate = data.sampleRate
    this.timeBase = data.timeBase
    this.type = data.type
    this.width = data.width
  }

  static fromProbe(stream: FfprobeStreamWithCodec) {
    const data: Omit<MediaStreamEntity, 'id' | 'mediaId'> = {
      aspectRatio: parseAspectRatio(stream.display_aspect_ratio) ?? null,
      channelLayout: stream.channel_layout ?? null,
      channels: stream.channels ?? null,
      codec: stream.codec_name,
      frameRate: parseDivString(stream.r_frame_rate) ?? null,
      height: stream.height ?? null,
      index: stream.index,
      lang: stream.tags?.language ?? null,
      level: toNumber(stream.level) ?? null,
      pixelFormat: stream.pix_fmt ?? null,
      profile: stream.profile?.toString() ?? null,
      sampleRate: stream.sample_rate ?? null,
      timeBase: stream.time_base ?? null,
      type: stream.codec_type as 'audio' | 'video',
      width: stream.width ?? null,
    }

    return new MediaStreamModel(data)
  }
}
