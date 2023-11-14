import 'dotenv/config'
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { handler } from './clientWeb/build/handler.js'
import getTelemetry from './utils/getTelemetry.js'
import { telemetry } from './utils/dbcon.js'
import { hostname } from 'node:os'
import getHostnames from './api/getHostnames.js'
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
  const serverName = hostname()

  app.get('/api/gethostnames', async (req, res) => {
    try {
      let hostnames = await getHostnames()
      //appending current server to the end of the array
      res.json([...hostnames, serverName])
    } catch (e) {
      console.error({ error: e, msg: `Not able to fetch hostnames` })
    }
  })

  app.get('/api/tsClientData', async (req, res) => {
    try {
      let startingData = await telemetry
        .find({ 'meta.hostname': serverName })
        .sort({ time: -1 })
        .limit(300)
        .toArray()
      console.log('sending data')
      res.json(startingData)
    } catch (e) {
      console.error({
        error: e,
        msg: 'error getting clent data from change stream',
      })
    }
  })

  app.get('/api/tsClientData/count/:count', async (req, res) => {
    try {
      let changeData = await telemetry
        .find({ 'meta.hostname': serverName })
        .sort({ time: -1 })
        .limit(parseInt(req.params.count))
        .toArray()
      res.json(changeData)
    } catch (e) {
      console.error({
        error: e,
        msg: 'Not able to udpate metrics array length',
      })
    }
  })

  app.get('/api/serverchange/:host', async (req, res) => {
    res.status(200).json(req.params.host)
  })

  getTelemetry(thresholds, true, io)

  app.use(handler)

  httpServer.listen(PORT, () => {
    console.log(
      chalk.greenBright(serverName),
      chalk.yellowBright.bgBlack(`NSSM listening on port ${PORT}`)
    )
    console.log(chalk.yellowBright.bgBlack(`mem=${thresholds.memThreshold}`))
    console.log(chalk.yellowBright.bgBlack(`cpu=${thresholds.cpuThreshold}`))
  })
  // getAvgMem(22)
}
