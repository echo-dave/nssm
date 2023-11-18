import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
// process.env.BROWSER = 'Safari Technology Preview'
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    open: '/',
    proxy: {
      '^/api/.*': 'http://localhost:3006',
      '/socket.io': {
        target: 'ws://localhost:3006',
        ws: true
      }
    }
  }
})
