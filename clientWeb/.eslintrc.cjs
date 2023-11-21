module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  settings: {
    'svelte3/ignore-warnings': (warning) => {
      if (warning.code === 'a11y-click-events-have-key-events')
        return warning.code === 'a11y-click-events-have-key-events'
      if (warning.code === 'a11y-no-noninteractive-element-interactions')
        return (warning.code = 'a11y-no-noninteractive-element-interactions')
    }
  }
}
