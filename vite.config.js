import appConfig from './src/config/appConfig.js';
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: { [appConfig.apiBaseUrl]: appConfig.local.apiTarget } },
})
