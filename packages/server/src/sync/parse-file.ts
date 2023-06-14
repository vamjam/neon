import fs from 'node:fs/promises'
import util from 'node:util'
import { MimeType, fileTypeFromFile } from 'file-type'
import type Ffmpeg from 'fluent-ffmpeg'
import imageSizer from 'image-size'
import { MediaType, MediaTypes } from '@shared/enums'
import { MediaEntity } from '@shared/types'
import { MediaStreamEntity } from '@shared/types/MediaStream'
import { isNullOrEmpty } from '@shared/utils/string'
import { ffprobe } from '~/ffmpeg'
import { FfprobeStreamWithCodec, MediaStreamModel } from '~/models'

const imageSize = util.promisify(imageSizer)
const mediaTypes = Object.values(MediaTypes)

const isMedia = (mime: MimeType) => {
  const [type] = mime.split('/')

  for (const mediaType of mediaTypes) {
    if (type === mediaType) {
      return mediaType
    }
  }
}

const parseMediaTypes = async (file: string) => {
  const fileType = await fileTypeFromFile(file)

  if (fileType != null) {
    return {
      mediaType: isMedia(fileType.mime),
      mimeType: fileType.mime,
    }
  }
}

const parseDimensions = async (
  filePath: string,
  type: MediaType,
  streams?: Omit<MediaStreamEntity, 'id' | 'mediaId'>[]
) => {
  if (type === MediaTypes.Image) {
    const size = await imageSize(filePath)

    return {
      width: size?.width ?? null,
      height: size?.height ?? null,
    }
  }

  if (type === MediaTypes.Video) {
    const videoStream = streams?.find((stream) => stream.type === 'video')

    return {
      width: videoStream?.width ?? null,
      height: videoStream?.height ?? null,
    }
  }

  return {
    width: null,
    height: null,
  }
}

const probeMedia = async (filePath: string, mediaType: MediaType) => {
  const data =
    mediaType === 'video' || mediaType === 'audio'
      ? await ffprobe(filePath)
      : undefined
  const streams = (
    data?.streams.filter((stream) => !isNullOrEmpty(stream.codec_name)) as
      | FfprobeStreamWithCodec[]
      | undefined
  )?.map(MediaStreamModel.fromProbe)

  const dimensions = await parseDimensions(filePath, mediaType, streams)
  const { size } = data?.format ?? (await fs.stat(filePath))

  return {
    streams,
    format: data?.format,
    size: size ?? null,
    ...dimensions,
  }
}

type Parsed = {
  file: Omit<
    MediaEntity,
    'id' | 'createdAt' | 'parentId' | 'importedAt' | 'url' | 'lastUpdatedAt'
  >
  streams: Omit<MediaStreamEntity, 'id' | 'mediaId'>[] | null
  format: Ffmpeg.FfprobeFormat | null
}

export class InvalidMediaFileException extends Error {}

export default async function parse(filePath: string): Promise<Parsed> {
  const info = await parseMediaTypes(filePath)

  if (!info || !info.mediaType) {
    throw new InvalidMediaFileException()
  }

  const probed = await probeMedia(filePath, info.mediaType)

  const data: Parsed = {
    file: {
      title: null,
      mediaType: info.mediaType,
      mimeType: info.mimeType,
      width: probed.width,
      height: probed.height,
      size: probed.size,
      container: probed.format?.format_name ?? null,
      bitRate: probed.format?.bit_rate ?? null,
    },
    streams: probed.streams ?? null,
    format: probed.format ?? null,
  }

  return data
}
