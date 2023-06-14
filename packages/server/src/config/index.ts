import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { app } from 'electron'
import { Schema } from 'electron-store'
import { ConfigStore } from './config-store'
import { merge } from './env'
import { ServerConfig } from './schema'
import schema from './schema.json' assert { type: 'json' }

const config = new ConfigStore({
  schema: schema.properties as Schema<ServerConfig>,
})

export default merge(config)

export const initConfig = async () => {
  const DB_PATH = path.join(app.getPath('appData'), 'neon.db')

  app.setAppLogsPath()

  const LOG_PATH = path.join(app.getPath('logs'), 'neon.log')

  config.set('db.url', pathToFileURL(DB_PATH).toString())
  config.set('log.url', pathToFileURL(LOG_PATH).toString())
}
