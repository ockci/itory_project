import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/itory_project/',
  server: {
    port: 3000,
    host: true
  }
})