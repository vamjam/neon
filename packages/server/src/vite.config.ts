import process from 'node:process'
import { InlineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import externalize from '../../shared/utils/externalize'
import root from '../../shared/utils/root'
import pkgJSON from '../package.json' assert { type: 'json' }
import conf from './config'

const config: InlineConfig = {
  root: root('src'),
  plugins: [tsconfigPaths({ root: root() })],
  server: {
    port: conf.get('server.port'),
  },
  build: {
    outDir: root('dist'),
    emptyOutDir: true,
    target: `node${process.versions.node}`,
    rollupOptions: {
      external: externalize(pkgJSON.dependencies),
    },
    lib: {
      entry: root('src/index.ts'),
      formats: ['es'],
      fileName: 'server',
    },
  },
}

export default config
