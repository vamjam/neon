import { ChildProcess, spawn } from 'node:child_process'
import process from 'node:process'
import chalk from 'chalk'
import { BuildOptions, build } from 'esbuild'
import root from '../../shared/utils/root.js'
import pkgJSON from '../package.json' assert { type: 'json' }

const isWatchMode = process.argv.includes('-w')
const [cmd, cmdArgs] = pkgJSON.scripts.start.split(' ')

let server: ChildProcess | null = null

const start = () => {
  server && server.kill()
  server = spawn(cmd, cmdArgs.split(' '), {
    stdio: 'inherit',
  })
}

const watch: BuildOptions['watch'] = isWatchMode
  ? {
      onRebuild(error) {
        if (error) {
          console.error(chalk.red.bold('watch build failed:'), error)
        } else {
          start()

          console.log(chalk.dim('watch build succeeded'))
        }
      },
    }
  : false

await build({
  entryPoints: [root('src/index.ts')],
  bundle: true,
  external: Object.keys(pkgJSON.dependencies),
  outfile: root('dist/server.js'),
  platform: 'node',
  target: `node${process.versions.node}`,
  sourcemap: true,
  format: 'esm',
  tsconfig: root('tsconfig.json'),
  watch,
})

if (isWatchMode) {
  start()
}
