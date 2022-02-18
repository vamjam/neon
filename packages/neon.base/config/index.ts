import fs from 'node:fs/promises'
import { Config } from '../types'
import dirname from '../utils/dirname.js'

const configPath = dirname('../neon.base/config/config.json')

export const getConfig = async (): Promise<Config> => {
  try {
    const config = await fs.readFile(configPath, 'utf8')

    return JSON.parse(config)
  } catch (err) {
    return {} as Config
  }
}

export const getItem = async (key: keyof Config) => {
  const config = await getConfig()

  return config[key]
}

export const setItem = async (key: keyof Config, value: string) => {
  const config = await getConfig()

  config[key] = value

  await fs.writeFile(configPath, JSON.stringify(config, null, 2))
}
