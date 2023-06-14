import http from 'node:http'
import path from 'node:path'
import { createTerminus } from '@godaddy/terminus'
import express from 'express'
import logger from 'logger'
import { apiRouter } from '~/api'
import config from '~/config'
import client from '~/db/client'
import open from '~/lib/open'

const log = logger('http.server')

const PORT = config.get('admin.port')
const ADMIN_URL = config.get('admin.url')
const SERVER_ROOT = path.join(process.cwd(), '../admin/src')
const INDEX_HTML = path.join(SERVER_ROOT, 'index.html')
// const assets = path.join(root, 'assets')

const onHealthCheck = async () => {
  return Promise.resolve()
}

export const start = async () => {
  const app = express()

  app.set('x-powered-by', false)

  const server = createTerminus(http.createServer(app), {
    signal: 'SIGINT',
    healthChecks: {
      '/healthcheck': onHealthCheck,
    },
    onSignal: async () => {
      log.info(`Server is shutting down...\n`)

      await client.destroy()

      server.close()
    },
  })

  // app.use('/assets', express.static(assets))

  app.get('/', (_, res) => {
    res.sendFile(INDEX_HTML)
  })

  app.use('/api', apiRouter)

  await new Promise<void>((resolve) => void server.listen(PORT, resolve))

  log.info(`neon http server listening on ${ADMIN_URL}`)

  if (config.get('admin.autoLaunch') === true) {
    await open(ADMIN_URL)
  }

  return server
}
