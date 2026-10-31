import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 會掛在 /<repo 名稱>/ 底下
  base: '/sing-at-christmas-2026/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // 非公開的結果頁，網址刻意取成不好猜的名稱
        results: resolve(__dirname, 'results-0d9b3b9f/index.html'),
      },
    },
  },
})
