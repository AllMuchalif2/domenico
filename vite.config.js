import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      includeAssets: ['pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'DOMENICO WEATHER SYS',
        short_name: 'DOMENICO',
        description: 'Dynamic Operational Meteorological Evangelist Network of Indonesian Climate Oracle',
        theme_color: '#0d0d0d',
        background_color: '#0d0d0d',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'DOMENICO Desktop Dashboard View'
          },
          {
            src: 'screenshot-mobile.jpeg',
            sizes: '720x1280',
            type: 'image/jpeg',
            form_factor: 'narrow',
            label: 'DOMENICO Mobile View'
          }
        ]
      }
    })
  ],
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
