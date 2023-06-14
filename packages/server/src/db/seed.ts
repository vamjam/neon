import { Knex } from 'knex'
import logger from 'logger'

const log = logger('db.seed')

export default async function seed(client: Knex) {
  const sql = await import('./seed.sql?raw')

  log.debug(`Seeding database...`)

  const queries = sql.default.split(';').filter((cmd) => cmd.trim() !== '')

  for await (const query of queries) {
    try {
      await client.raw(query)
    } catch (err) {
      log.error(`Unable to execute sql command: "${query}"`, err as Error)
    }
  }

  log.debug(`Database seeded successfully`)
}
