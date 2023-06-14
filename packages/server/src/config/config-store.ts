import Store from 'electron-store'
import { ServerConfig } from './schema'

const escape = (str: string) => str.replace(/[\\.[]/g, '\\$&')

export type ConfigKey = keyof ServerConfig

// The only reason this exists, is to allow us to use dot
// notation in `get` and `set` calls, without having to
// escape it, every god damn time.
export class ConfigStore extends Store<ServerConfig> {
  get<K extends ConfigKey>(key: K): ServerConfig[K] {
    return super.get(escape(key))
  }

  set<K extends ConfigKey>(key: K, value?: ServerConfig[K]): void {
    return super.set(escape(key), value)
  }

  has<K extends ConfigKey>(key: K) {
    return super.has(escape(key))
  }
}
