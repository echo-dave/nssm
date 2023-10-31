import {telemetry} from '../utils/dbcon.js'
import dispTelemetry from '../utils/dispTelemetry.js'


// change stream unsupported with time series collections - planned for future
// const changeStream = telemetry.watch()
// changeStream.on('change', next => {
//     console.log('change');
//     console.dir(next,{depth: 2})
// })
(async () => {
const data = await telemetry.findOne({},{projection:{_id:0},sort:{_id: -1}})
console.log('data: ', data)

dispTelemetry(data)

})()