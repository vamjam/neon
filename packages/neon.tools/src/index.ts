import process from 'node:process'
import * as build from './build.js'

const args = process.argv.slice(2)

async function main() {
  const [command, proj] = args
  const watch = args.includes('--watch')

  if (command === 'build') {
    await build[proj as 'main' | 'server']({
      watch,
    })
  }
}

main().catch(() => process.exit(1))
