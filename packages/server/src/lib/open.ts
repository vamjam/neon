import { shell } from 'electron'

export default async function open(url: string) {
  shell.openExternal(url)
}
