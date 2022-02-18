import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import path from 'node:path'
import { WebSocketServer, createWebSocketStream } from 'ws'
import { Config } from '@neon/base/types'
import banner from '@neon/base/utils/banner'
import log from '@neon/base/utils/logger'
import connect from '~/db'

const require = createRequire(import.meta.url)

const rootdir = process.cwd()

const root = (...args: string[]) => path.join(rootdir, ...args)

const ports = {
  ws: 3838,
  http: 3030,
}

const neon = {
  ws: 'neon.server.ws',
  http: 'neon.server.http',
}

const getConfig = async (): Promise<Config | undefined> => {
  const db = await connect()

  return db.objects<Config>('Config')?.[0]
}

const ws = async () => {
  const logStream = fs.createReadStream(root('dist/.logs/neon.server.log'))
  const server = createServer()
  const config = await getConfig()

  const wss = new WebSocketServer({
    server,
    perMessageDeflate: false,
  })

  wss.on('error', (err) => {
    log.error(err)
  })

  wss.on('connection', (ws) => {
    const duplex = createWebSocketStream(ws)

    duplex.write('Welcome to')

    setTimeout(() => {
      duplex.write(chalk.magenta(banner))

      logStream.pipe(duplex)
    }, 1500)
  })

  server.listen(ports.ws, () =>
    log.info(
      chalk.gray(
        `${chalk.blue(neon.ws)} running on ${chalk.green(
          `ws://localhost:${ports.ws}`
        )}`
      )
    )
  )
}

const http = async () => {
  const app = express()
  const server = createServer(app)
  const config = await getConfig()

  const manifest = require(root('dist/neon.server/manifest.json'))
  const html = await fsp.readFile(root('dist/neon.server/index.html'), 'utf8')

  app.use(cors({ origin: '*' }))
  app.use('/assets', express.static(root('dist/neon.server/assets')))

  app.use('*', (_, res) =>
    res
      .status(200)
      .send(html.replace('<%= ./index.tsx %>', manifest['index.tsx'].file))
  )

  server.listen(3030, () => {
    log.info(
      chalk.gray(
        `${chalk.blue(neon.http)} running on ${chalk.green(
          `http://localhost:${ports.http}`
        )}`
      )
    )
  })
}

const services = [ws, http]

services.map((service) =>
  service().catch((err) => {
    console.error(err)

    process.exit(1)
  })
)
