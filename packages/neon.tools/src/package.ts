import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import template from './template.json'

const require = createRequire(import.meta.url)

const rootdir = process.cwd()

const root = (...args: string[]) => path.join(rootdir, ...args)

export type PackageJSON = typeof template

export const packages: Record<string, PackageJSON> = {
  'neon.main': require(root('package.json')),
  // 'neon.admin': require(root('packages/neon.admin/package.json')),
  'neon.server': require(root('packages/neon.server/package.json')),
}

export const createMainPackage = async () => {
  const deps = Object.values(packages).reduce((acc, pkg) => {
    return {
      ...acc,
      ...pkg.dependencies,
    }
  }, {})

  const mainPackage = {
    ...template,
    dependencies: deps,
  }

  await fs.writeFile(
    root('dist/package.json'),
    JSON.stringify(mainPackage, null, 2)
  )
}
