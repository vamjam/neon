import fs, { constants } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import logger from 'logger'
import { MediaEntity } from '@shared/types'
import { mediaRepository } from '~/db'
import { url } from '~/maps'

const log = logger('media.sync.db')

const exists = async (filePath: string) => {
  try {
    await fs.access(filePath, constants.F_OK)

    return true
  } catch {
    return false
  }
}

const checkMediaItem = async (
  data: Pick<MediaEntity, 'id' | 'url' | 'mediaType' | 'title'>
) => {
  const entURL = url.fromEntity(data.url)

  if (entURL != null) {
    const entExists = await exists(fileURLToPath(entURL))

    if (!entExists) {
      // The repository handles deleting descendents
      await mediaRepository.deleteMedia(data.id)

      log.info(
        `Deleted "${data.title}" because it no longer exists on the file system.`
      )
    }
  }
}

export default function sync(): Promise<void> {
  log.info(`Syncing database`)
  return new Promise((resolve, reject) => {
    const stream = mediaRepository.getMediaAsStream(
      'id',
      'url',
      'mediaType',
      'title'
    )

    stream
      .on('data', checkMediaItem)
      .on('error', reject)
      .on('end', () => {
        log.info(`Sync complete`)

        resolve()
      })
  })
}
