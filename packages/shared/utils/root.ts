import path from 'node:path'

export default function root(...paths: string[]) {
  return path.join(process.cwd(), ...paths)
}
