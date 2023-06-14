export const MediaTypes = {
  Folder: 'folder',
  Video: 'video',
  Audio: 'audio',
  Image: 'image',
} as const

type MediaType = (typeof MediaTypes)[keyof typeof MediaTypes]

export default MediaType
