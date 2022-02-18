import chalk from 'chalk'
import esbuild, { BuildOptions } from 'esbuild'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { createMainPackage, packages } from './package.js'

const require = createRequire(import.meta.url)

const rootdir = process.cwd()

const root = (...args: string[]) => path.join(rootdir, ...args)

// This could be improved, and will almost certainly break
// but this grabs the node version from the "engines" field,
// just in a specific format
const target = `node${packages['neon.main'].engines.node.split('=')[1]}`

const defaultBuildOptions: BuildOptions = {
  target,
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  incremental: true,
  minify: false,
  allowOverwrite: true,
  loader: {
    '.html': 'text',
  },
}

export const main = async () => {
  await createMainPackage()

  await clean()
}

// export const client = async (options: BuildOptions): Promise<void> => {
//   // At this point, Vite has already built the client, so
//   // here we only need to worry about the server files.
//   await copyDir(root('dist/neon.admin/src/server'), root('dist/neon.admin'))

//   // await buildAdminClientHTML()

//   await buildProject('neon.admin', {
//     ...options,
//     entryPoints: [root('dist/neon.admin/index.js')],
//     outdir: root('dist/neon.admin/'),
//   })
// }
const copyFilesToDist = async (...files: string[]) => {
  for await (const file of files) {
    await fs.copyFile(file, root(`dist/neon.server/${path.basename(file)}`))
  }
}

export const server = async (options = {} as BuildOptions): Promise<void> => {
  // await fs.copyFile(
  //   root('dist/neon.service/src/pm.config.json'),
  //   root('dist/pm.config.json')
  // )
  try {
    await copyFilesToDist(
      root('packages/neon.server/src/index.html')
      // root('packages/neon.server/src/test.log')
    )
    const external = packages['neon.server'].dependencies

    await esbuild.build({
      ...defaultBuildOptions,
      entryPoints: [root('packages/neon.server/src/index.ts')],
      outdir: root('dist/neon.server/'),
      external: Object.keys(external),
    })

    if (options.watch === true) {
      console.log(chalk.blue(`Running build in watch mode`))
    } else {
      console.log(chalk.green(`\nneon.server build complete`))

      process.exit(0)
    }
  } catch (err) {
    console.error(
      chalk.red(`\nFailed to build neon.server: ${(err as Error)?.message}`)
    )
  }
}

const buildAdminClientHTML = async (): Promise<void> => {
  // the manfest file created by Vite, which contains pointers
  // to the generated files from that build.
  const manifest = require(root('dist/neon.server/manifest.json'))

  let html = await fs.readFile(
    path.join(rootdir, 'packages/neon.server/src/client/index.html'),
    'utf-8'
  )

  html = html.replace('<%= ./index.tsx %>', manifest['index.tsx'].file)

  await fs.writeFile(path.join(rootdir, 'dist/neon.server/index.html'), html)
}

const clean = async () => {
  // delete all "@types" folders
  const folders = [
    path.join(rootdir, 'dist/neon.admin/@types'),
    path.join(rootdir, 'dist/neon.service/@types'),
    path.join(rootdir, 'dist/neon.base/@types'),
  ]

  for await (const folder of folders) {
    try {
      await fs.rm(folder, { recursive: true })
    } catch {
      // do nothing
    }
  }
}

const copyDir = async (src: string, dest: string) => {
  const [entries] = await Promise.all([
    fs.readdir(src, { withFileTypes: true }),
    fs.mkdir(dest, { recursive: true }),
  ])

  await Promise.all(
    entries.map((entry) => {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      return entry.isDirectory()
        ? copyDir(srcPath, destPath)
        : fs.copyFile(srcPath, destPath)
    })
  )
}
