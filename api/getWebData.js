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
          console.warn(err)
        } else if (response[0] === 'ok') {
          console.log('webData Response', response)
          dataLoop()
        }
      })
  }
  dataLoop()
}
export default getWebData
