import dotenv from 'dotenv'
const envUrl = new URL('.env', import.meta.url).pathname.replace(
  /(utils\/)/,
  ''
)

export default dotenv.config({ path: envUrl })
