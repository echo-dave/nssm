import {telemetry} from '../utils/dbcon.js'
import dispTelemetry from '../utils/dispTelemetry.js'


// change stream unsupported with time series collections - planned for future
const getClientData = async (hostname) => {
    console.log('getting data: ', hostname)
    const pipeline = []
    if (hostname?.length > 1) {
    pipeline.push({$match: {'fullDocument.meta.hostname': hostname}})
    }
    try {
    const changeStream = telemetry.watch(pipeline)
    while (await changeStream.hasNext()) {
        const next = await changeStream.next();
        dispTelemetry(next.fullDocument)
    }
    } catch(e) {console.error(e)}
}

export default getClientData