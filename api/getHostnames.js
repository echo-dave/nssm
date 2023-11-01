import {telemetry} from '../utils/dbcon.js'

const getHostnames = async () =>  await telemetry.distinct('meta.hostname')

export default getHostnames