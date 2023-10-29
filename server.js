import 'dotenv/config'
import express from 'express'
import getTelemetry from './utils/getTelemetry.js'
import {log} from 'node:console'
import {MongoClient, ServerApiVersion} from 'mongodb'
const app = express();
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
    console.log(`NSSM listening on port ${PORT}`)
  })

getTelemetry("headless")