import 'dotenv/config'
import express from 'express'
import getTelemetry from './utils/getTelemetry.js'
import {log} from 'node:console'
import {ping as pingMongo} from './utils/dbcon.js'
import chalk from 'chalk'
import {getAvgMem} from './api/getAvgMem.js'
const app = express();
const PORT = process.env.PORT || 3002


await pingMongo()

app.listen(PORT, () => {
    console.log(chalk.yellowBright.bgBlack(`NSSM listening on port ${PORT}`))
  })


getTelemetry(process.env.HEADLESS)
// getAvgMem(22)