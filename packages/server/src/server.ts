import { fileURLToPath, pathToFileURL } from 'node:url'
import logger from 'logger'
import { isNullOrEmpty } from '@shared/utils/string'
import config from '~/config'
import { httpServer } from '~/http'
import sync from '~/sync'

const log = logger('server')

await httpServer.start()

log.info(`urls: `, {
  config: pathToFileURL(config.path).href,
  logs: config.get('log.url'),
  db: config.get('db.url'),
})

const library = config.get('library.url')

if (isNullOrEmpty(library)) {
  log.error(`No library configured.`)
} else {
  await sync(fileURLToPath(library))
}
