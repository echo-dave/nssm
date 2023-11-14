import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'

export default {
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter({
      // default options are shown
      out: 'build',
      precompress: false,
      envPrefix: '',
      polyfill: false
    })
  }
}
