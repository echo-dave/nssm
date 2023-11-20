import { telemetry } from '../utils/dbcon.js'

const getWebData = (hostname, io) => {
  console.log('web', hostname)
  const pipeline = [{ $match: { 'fullDocument.meta.hostname': hostname } }]
  const changeStream = telemetry.watch(pipeline, {
    fullDocument: 'updateLookup',
  })
  const dataLoop = async () => {
    await changeStream.hasNext()
    const next = await changeStream.next()
    io.timeout(2000)
      .to(hostname)
      .emit('dataB', next.fullDocument, (err, response) => {
        if (err) {
          monitoringState[hostname] -= 1
          console.warn(err)
        }
        if (response[0] === 'ok') {
          dataLoop()
          // if (monitoringState[hostname] !== response.length) {
          //   monitoringState[hostname] = response.length
          // }
        }
        // if (response[0] !== 'ok') monitoringState[hostname] = 0
      })
  }
  dataLoop()
}
export default getWebData
