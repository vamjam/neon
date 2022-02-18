import figlet from 'figlet'
import fs from 'node:fs/promises'

const banner = figlet.textSync('neon', { font: 'Rozzo' })
const content = "export default `" + banner + "`\n"

await fs.writeFile('../packages/neon.base/utils/banner.ts', content)
