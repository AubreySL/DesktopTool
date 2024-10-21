import { defineConfig } from 'vite'

// https://vitejs.dev/config

export default defineConfig({
  
  build: {
    rollupOptions: {
      external: ['serialport', 'sqlite3' , 'ws'],
    },
  },
})
