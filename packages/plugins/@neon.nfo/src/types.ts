export type Actor = {
  name?: string
  type?: string
  role?: string
  order?: string | number
  thumb?: string
}

export type Audio = {
  codec?: string
  language?: string
  channels?: string | number
}

export type Video = {
  codec?: string
  aspect?: string | number
  width?: string | number
  height?: string | number
  durationinseconds?: string | number
  stereomode?: string
}

export type StreamDetails = {
  [key: string]: unknown
  aspect?: string
  aspectratio?: string
  audio?: Audio[]
  bitrate?: string | number
  channels?: string | number
  codec?: string
  default?: string | boolean
  duration?: string | number
  durationinseconds?: string | number
  forced?: string | boolean
  framerate?: string | number
  height?: string | number
  language?: string
  micodec?: string
  samplingrate?: string | number
  scantype?: string
  subtitle?: {
    language?: string
  }
  video?: Video
  width?: string | number
}

export type Art = {
  [type: string]: string | undefined
  poster?: string
}

export type Rating = {
  value?: string | number
  votes?: string | number
  '@_name'?: string
  '@_max'?: string | number
  '@_default'?: string | boolean
}

export type Set = {
  name?: string
  overview?: string
}

export type UniqueId = {
  '#text'?: string
  '@_type'?: string
  '@_default'?: string | boolean
}

export type Resume = {
  position?: string | number
  total?: string | number
}

export type Thumb = {
  '#text'?: string
  '@_spoof'?: string
  '@_colors'?: string
  '@_cache'?: string
  '@_aspect'?: string
  '@_preview'?: string
}

export type Movie = {
  actor?: Actor | Actor[]
  aired?: string
  art?: Art
  code?: string
  country?: string
  credits?: string
  dateadded?: string | Date
  director?: string
  fileinfo?: {
    streamdetails?: StreamDetails
  }
  genre?: string
  id?: string | number
  lastplayed?: string
  lockdata?: string | boolean
  mpaa?: string
  originaltitle?: string
  outline?: string
  playcount?: string
  plot?: string
  premiered?: string
  ratings?: {
    rating?: Rating | Rating[]
  }
  resume?: Resume
  runtime?: string | number
  set?: Set
  sorttitle?: string
  status?: string
  studio?: string
  tag?: string
  tagline?: string
  thumb?: Thumb[]
  title?: string
  top250?: string
  trailer?: string
  uniqueid?: UniqueId[]
  userrating?: string
  year?: string
}

type NFO = {
  movie?: Movie
}

export default NFO
