import {telemetry} from '../utils/dbcon.js'
import dispTelemetry from '../utils/dispTelemetry.js'


// change stream unsupported with time series collections - planned for future
const changeStream = telemetry.watch()
while (await changeStream.hasNext()) {
    const next = await changeStream.next();
    dispTelemetry(next.fullDocument)
}
