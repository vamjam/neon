import react from '@vitejs/plugin-react'
import { InlineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import root from '../../shared/utils/root'

const config: InlineConfig = {
  root: root('src'),
  plugins: [react(), tsconfigPaths({ root: root() })],
  build: {
    outDir: root('dist'),
  },
}

export default config
