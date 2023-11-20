import './utils/dotEnvConfig.js'
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { handler } from './clientWeb/build/handler.js'
import getTelemetry from './utils/getTelemetry.js'
import { telemetry } from './utils/dbcon.js'
import { hostname } from 'node:os'
import getHostnames from './api/getHostnames.js'
import chalk from 'chalk'
import getWebData from './api/getWebData.js'
import { getAvgMem } from './api/getAvgMem.js'

export default async (thresholds) => {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer)

  const PORT = process.env.PORT || 3006
  global.monitoringState = {}
  const serverName = hostname().replace(/(.local)$/, '')

  io.on('connection', (socket) => {
    socket.on('subscribe', (serverHostName) => {
      socket.join(serverHostName)
      console.log('join:', serverHostName)
      if (Array.isArray(serverHostName)) {
        serverHostName = serverHostName.filter((el) => el !== serverName)
        serverHostName.forEach((hostJoining) => {
          if (
            !monitoringState[hostJoining] ||
            monitoringState[hostJoining] < 1
          ) {
            console.log('rejoin')
            getWebData(hostJoining, io)
          }
        })
      }
    })
    socket.on('unsubscribe', (serverHostName) => {
      console.log('unsubServer:', serverHostName)
      monitoringState[serverHostName] -= 1
      socket.leave(serverHostName, (err) => {
        console.error({ error: err, msg: 'error unsubscribing socket' })
      })
    })
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

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

  app.get('/api/tsClientData/:server/:count', async (req, res) => {
    const data = await getHistory(req.params.count, req.params.server)
    res.status(200).json(data)
  })

  app.get('/api/serverchange/:host/:count', async (req, res) => {
    const data = await getHistory(req.params.count, req.params.host)
    if (monitoringState[req.params.host]) {
      monitoringState[req.params.host] += 1
      console.log('change: ', monitoringState)
    } else monitoringState[req.params.host] = 1

    if (
      monitoringState[req.params.host] === 1 &&
      req.params.host !== serverName
    ) {
      getWebData(req.params.host, io)
    }
    console.log('change else: ', monitoringState)

    res.status(200).json(data)
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

async function getHistory(count, serverName) {
  try {
    return await telemetry
      .find({ 'meta.hostname': serverName })
      .sort({ time: -1 })
      .limit(parseInt(count))
      .toArray()
  } catch (e) {
    console.error({
      error: e,
      msg: 'Not able to udpate metrics array length',
    })
  }
}
