import { telemetry } from '../utils/dbcon.js'
import { log } from 'node:console'

let logStartup = 1
export default async (data) => {
  try {
    let result = await telemetry.insertOne(data)
    // let result = await client.db(process.env.MONGO_DB).collection('telemetry').insertOne(data)
    if (logStartup === 1) {
      log(result)
      logStartup = 0
    }
  } catch (e) {
    console.error({ error: e, msg: 'Failed to insert data' })
  }
}
