import react from '@vitejs/plugin-react'
import { InlineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import externalize from '../../shared/utils/externalize'
import root from '../../shared/utils/root'
import pkgJSON from '../package.json' assert { type: 'json' }

const config: InlineConfig = {
  root: root('src'),
  plugins: [react(), tsconfigPaths({ root: root() })],
  build: {
    outDir: root('dist'),
    emptyOutDir: true,
    minify: process.env.NODE_ENV === 'production',
    rollupOptions: {
      external: externalize(pkgJSON.dependencies),
    },
  },
}

export default config
