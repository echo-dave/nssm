import { telemetry } from '../utils/dbcon.js'
import dispTelemetry from '../utils/dispTelemetry.js'
import rl from 'node:readline'
let gettingData

const serverChangeHandler = async function () {
  rl.emitKeypressEvents(process.stdin)
  if (process.stdin.isTTY) process.stdin.setRawMode(true)
  process.stdin.resume()

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl == true && key.name == 'c') {
      process.exit()
    }
    if (key.ctrl === true && key.name === 'n') {
      gettingData = true
      const serverChange = setTimeout(async () => {
        const { default: client } = await import('../client.js')
        console.clear()
        client()
        return true
      }, 1200)
    }
  })
}

// change stream unsupported with time series collections - planned for future
const getClientData = async (hostname) => {
  // if (typeof(serverChange) !== 'undefined') clearTimeout(serverChange)
  gettingData = false
  gettingData = serverChangeHandler()
  console.log('getting data: ', hostname)
  const pipeline = []
  if (hostname?.length > 1) {
    pipeline.push({ $match: { 'fullDocument.meta.hostname': hostname } })
  }
  try {
    const changeStream = telemetry.watch(pipeline)
    let count = 1

    const getChangeStream = async () => {
      await changeStream.hasNext()
      const next = await changeStream.next()
      dispTelemetry(next.fullDocument)
      if (gettingData === true) {
        // console.log('break');
        changeStream.close()
        return
      } else getChangeStream()
      count++
    }
    getChangeStream()
  } catch (e) {
    console.error(e)
  }
}

export default getClientData
