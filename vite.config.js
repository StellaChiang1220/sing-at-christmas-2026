import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 會掛在 /<repo 名稱>/ 底下
  base: '/sing-at-christmas-2026/',
})
