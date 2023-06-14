import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Menu, Tray, app, nativeImage } from 'electron'
import logger from 'logger'
import playIcon from '~/assets/play-icon.png'
import config, { initConfig } from '~/config'
import open from '~/lib/open'

const log = logger('main')

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Open admin dashboard',
    async click() {
      await open(config.get('admin.url'))
    },
  },
  { label: 'Settings' },
])

const main = async () => {
  await app.whenReady()
  // await import('./server.js')

  const icon = nativeImage.createFromPath(playIcon)

  const tray = new Tray(icon)

  tray.setToolTip('neon media server')
  tray.setTitle('neon')
  tray.setContextMenu(contextMenu)
}

initConfig()
  .then(async () => {
    const logPath = fileURLToPath(config.get('log.url'))

    await logger.init(logPath)

    await main()
  })
  .catch((err) => {
    log.error(`Received an error in main, shutting down`, err)

    process.exit(1)
  })
