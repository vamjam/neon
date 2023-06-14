import knex from 'knex'
import logger from 'logger'
import { fileURLToPath } from 'url'
import config from '~/config'
import seed from './seed'

const log = logger('db.client')

const FILENAME = fileURLToPath(new URL(config.get('db.url')))

const client = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: FILENAME,
    multipleStatements: true,
  },
})

log.info(`Database connected.`)

seed(client)

export default client
