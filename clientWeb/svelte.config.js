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
  },
  onwarn: (warning, handler) => {
    if (warning.code === 'a11y-click-events-have-key-events') return handler(warning)
    if (warning.code === 'a11y-no-noninteractive-element-interactions') return handler(warning)
  }
}
