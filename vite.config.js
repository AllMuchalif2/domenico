import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wilayah': {
        target: 'https://wilayah.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wilayah/, ''),
      },
    },
  },
})
