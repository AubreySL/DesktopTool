// https://vitejs.dev/config
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
 
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,//fix require() in es lib
    },
    rollupOptions: {
      external: ['serialport', 'sqlite3' ],
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'library': ['turndown', 'ant-design-vue', 'turndown-plugin-gfm', '@mixmark-io/domino'],
          'puppeteer': ['puppeteer']
        }
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
