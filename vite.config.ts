import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, /api/* va a la Pages Function que corre con `npm run pages:dev` (puerto 8788)
    proxy: {
      '/api': 'http://127.0.0.1:8788',
    },
  },
})
