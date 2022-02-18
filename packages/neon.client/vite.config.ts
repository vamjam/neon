import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'

const root = path.join(__dirname, '../../')
const src = path.join(__dirname, './src')

const config: UserConfig = {
  root: src,
  // envDir: '../../',
  // envPrefix: 'PUBLIC',
  build: {
    manifest: true,
    rollupOptions: {
      input: path.join(src, 'index.tsx'),
    },
    outDir: path.join(root, 'dist/neon.server/'),
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '~': src,
    },
  },
  plugins: [react()],
}

export default config
