import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/properties': 'http://localhost:3000',
      '/ai': 'http://localhost:3000'
    }
  }
})
