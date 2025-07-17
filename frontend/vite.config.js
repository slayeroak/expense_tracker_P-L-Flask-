// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import history from 'connect-history-api-fallback'

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false,
    setup: ({ middlewares }) => {
      // this must come before vite's own middlewares
      middlewares.use(history({ index: '/index.html' }))
      return middlewares
    }
  }
})
