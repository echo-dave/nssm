import 'dotenv/config'
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
// import { handler } from './clientWeb/build/handler.js'
import getTelemetry from './utils/getTelemetry.js'
import { telemetry, client } from './utils/dbcon.js'
import { log } from 'node:console'
import { ping as pingMongo } from './utils/dbcon.js'
import chalk from 'chalk'
import { getAvgMem } from './api/getAvgMem.js'

export default async (thresholds, isHeadless) => {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer)

  const PORT = process.env.PORT || 3006

  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  app.get('/api/tsClientData', async (req, res) => {
    try {
      let startingData = await telemetry
        .find({ 'meta.hostname': 'Brilliance' })
        .sort({ time: -1 })
        .limit(300)
        .toArray()
      console.log('sending data')
      await res.json(startingData)
    } catch (e) {
      console.error(e)
    }
  })

  app.get('/api/tsClientData/count/:count', async (req, res) => {
    console.log('count', parseInt(req.params.count.slice(1)))
    try {
      let changeData = await telemetry
        .find({ 'meta.hostname': 'Brilliance' })
        .sort({ time: -1 })
        .limit(parseInt(req.params.count.slice(1)))
        .toArray()
      console.log('sending data chang count')
      await res.json(changeData)
    } catch (e) {
      console.error(e)
    }
  })

  // let thresholds = { memThreshold: 0.1, cpuThreshold: 0.1 }
  getTelemetry(thresholds, true, io)

  // let data = await getTelemetry(thresholds, true)

  // await pingMongo()
  // app.use(handler)

  httpServer.listen(PORT, () => {
    console.log(chalk.yellowBright.bgBlack(`NSSM listening on port ${PORT}`))
  })
  // getAvgMem(22)
}
