export type MediaStreamEntity = {
  id: number
  mediaId: number
  index: number

  aspectRatio: string | null
  channelLayout: string | null
  channels: number | null
  codec: string
  frameRate: number | null
  height: number | null
  lang: string | null
  level: number | null
  pixelFormat: string | null
  profile: string | null
  sampleRate: number | null
  timeBase: string | null
  type: 'audio' | 'video'
  width: number | null
}

type MediaStream = Omit<MediaStreamEntity, 'id' | 'mediaId'> & {
  id: string
  mediaId: string
}

export default MediaStream
