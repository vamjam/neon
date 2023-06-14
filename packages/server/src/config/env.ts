import process from 'node:process'
import yargs from 'yargs-parser'
import { type ConfigStore } from './config-store'
import { ServerConfig } from './schema'

const argv = yargs(process.argv.slice(2), {
  configuration: {
    'dot-notation': false,
  },
})

export const merge = (config: ConfigStore) => {
  for (const [key, value] of Object.entries(argv)) {
    if (config.has(key as keyof ServerConfig)) {
      config.set(key as keyof ServerConfig, value)
    }
  }

  return config
}
