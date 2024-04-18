import { defineConfig } from 'vite'
export default defineConfig({
  // ...省略其它
  server: {
    open: true,
    host: true,
    port: 9547
  }
})
