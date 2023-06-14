import { Dirent } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import logger from 'logger'
import { MediaTypes } from '@shared/enums'
import { mediaRepository } from '~/db'
import { url } from '~/maps'
import parseFile, { InvalidMediaFileException } from './parse-file'

const log = logger('media.sync.fs')

type CreateParams = Parameters<(typeof mediaRepository)['create']>

const saveMedia = async (
  data: CreateParams[0],
  art?: CreateParams[1],
  streams?: CreateParams[2]
) => {
  try {
    const id = await mediaRepository.create(data, art, streams)

    log.info(`Created media with id "${id}"`)

    return id
  } catch (err) {
    log.error(
      `Unable to save "${data.title}", type: ${data.mediaType}`,
      err as Error
    )
  }
}

const createSavedMediaFinder = async (parentId: number | null) => {
  const savedMedia = await mediaRepository.getMediaByParentId(parentId)

  return (filePath: string) => {
    const urlEntity = url.toEntity(pathToFileURL(filePath))

    return savedMedia.find((m) => m.url === urlEntity)
  }
}

const parseDirent = async (
  dirent: Dirent,
  filePath: string,
  parentId: number | null
) => {
  const common = {
    title: path.basename(dirent.name, path.extname(filePath)),
    url: url.toEntity(pathToFileURL(filePath)),
    parentId,
  }

  if (dirent.isDirectory()) {
    const result = await saveMedia({
      ...common,
      mediaType: MediaTypes.Folder,
      mimeType: null,
      bitRate: null,
      container: null,
      height: null,
      width: null,
      size: null,
    })

    if (result != null) {
      await sync(filePath, result)
    } else {
      log.warn(`Unknown error saving directory at "${filePath}"`)
    }

    return
  }

  if (dirent.isFile()) {
    try {
      const parsed = await parseFile(filePath)

      await saveMedia(
        {
          ...parsed.file,
          ...common,
        },
        undefined,
        parsed.streams
      )
    } catch (err) {
      if (err instanceof InvalidMediaFileException) {
        log.info(`Skipping non-media file`)

        return
      }

      log.error(`Unable to parse file at "${filePath}"`, err as Error)
    }
  }
}

export default async function sync(dir: string, parentId: number | null) {
  log.info(`Syncing directory "${dir}"`)

  const ents = await fs.readdir(dir, {
    withFileTypes: true,
  })

  const findSavedMedia = await createSavedMediaFinder(parentId)

  for await (const ent of ents) {
    const fullPath = path.resolve(dir, ent.name)

    try {
      if (findSavedMedia(fullPath)) {
        log.debug(`Found existing media`)

        continue
      }

      log.info(`Parsing "${fullPath}"`)

      await parseDirent(ent, fullPath, parentId)
    } catch (err) {
      log.error(`Unable to parse media`, err as Error)
    }
  }

  log.info(`Sync complete for "${dir}"`)
}
