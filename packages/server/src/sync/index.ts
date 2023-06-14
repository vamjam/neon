import syncdb from './sync.db'
import syncfs from './sync.fs'

export default async function sync(path: string) {
  await syncdb()
  await syncfs(path, null)
}
