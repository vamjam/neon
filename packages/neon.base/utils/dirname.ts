import path, { dirname as pathDirname } from 'node:path'
import { fileURLToPath } from 'url'

export const dirname = pathDirname(fileURLToPath(import.meta.url))

export default (...dir: string[]) => {
  return dir ? path.join(dirname, ...dir) : dirname
}
