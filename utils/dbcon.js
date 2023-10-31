import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb'
import chalk from 'chalk'
const info = (string) => console.log(chalk.yellowBright.bgBlack(string))
const tsCollection = 'ban8'
const log = (toLog) => console.dir(toLog, { depth: null, colors: true })
const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
//     {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// })

const findCollection = async (collections) => {
  info('\nMongo collection found and continuing startup \n')
  collections.map((el) => {
    el.name === tsCollection ? log(el) : null
  })
  return 'done'
}

const initializeDB = async (newCollection) => {
  try {
    info("\nMongo collection not found, we'll make one now! \n")
    await client.db(process.env.MONGO_DB).createCollection(newCollection, {
      timeseries: {
        timeField: 'time',
        metaField: 'meta',
        //   bucketMaxSpanSeconds: 2,
        //   bucketRoundingSeconds: 2,
        granularity: 'seconds',
      },
      expireAfterSeconds: 259200,
    })
    ping()
  } catch (e) {
    console.error(e)
  }
}

const ping = async () => {
  try {
    const collections = await client
      .db(process.env.MONGO_DB)
      .listCollections()
      .toArray()

    const exists = collections.some((el) => el.name === tsCollection)
    exists === true ? findCollection(collections) : initializeDB(tsCollection)
    // log(collections)
    // await client.db(process.env.MONGO_DB).command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (e) {
    console.error(e)
  }
}
// collections = await client.db(process.env.MONGO_DB).listCollections().toArray();

const db = (dbCollection) =>
  client.db(process.env.MONGO_DB).collection(dbCollection)
const telemetry = db('telemetry')
export { telemetry, db, client, ping }
