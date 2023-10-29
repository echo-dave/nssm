import db from '../utils/dbcon.js'

export default async (data) => {
  try {
    let telemetry = await db.collection('telemetry')
    let result = await telemetry.insertOne(data)

    console.log(result)
  } catch (e) {
    console.log(e)
  }
}
