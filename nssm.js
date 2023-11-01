#!node
import { argv } from 'node:process'
import getTelemetry from './utils/getTelemetry.js'
import client from './client.js'
import chalk from 'chalk'
const green = chalk.green
switch (true) {
  case argv.indexOf('-s') > 1:
    getTelemetry('isHeadless')
    break
  case argv.indexOf('-c') > 1 :
    client()
    break
  case argv.indexOf('-l') > 1 :
    getTelemetry()
    break

  default:
    console.log(`nssm accepts one of 3 options:
    ${green('-s')} server mode for database logging
    -c client mode for readding and monitoring remotely
    -l local mode for monoitoring locally without logging`)
    process.exit(0)
    break
}
