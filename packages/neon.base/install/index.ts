import fs from 'node:fs/promises'
import dirname from '../utils/dirname.js'
import writeConfig from './writeConfig.js'

const configPath = dirname('../config/config.json')

const hasInstalled = async () => {
  try {
    const json = await fs.readFile(configPath, 'utf8')

    if (json != null) {
      const config = JSON.parse(json)

      if (config['admin.port'] === '') {
        return false
      }
    }

    return true
  } catch (err) {
    return false
  }
}

const install = async () => {
  writeConfig(configPath).then(() => {
    console.log('neon installed successfully')

    process.exit(0)
  })
}

hasInstalled().then(async (hasInstalled) => {
  if (hasInstalled) {
    process.exit(0)
  } else {
    await install()
  }
})
