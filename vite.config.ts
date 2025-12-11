import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true,
    allowedHosts: [
      '5174-iiird9f9g20znnr8k9xh4-fbdbf5ef.manusvm.computer',
      '5175-iiird9f9g20znnr8k9xh4-fbdbf5ef.manusvm.computer',
      '.manusvm.computer',
    ],
  },
})
