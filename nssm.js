#!node
import { argv } from 'node:process'
import getTelemetry from './utils/getTelemetry.js'
import client from './client.js'
import chalk from 'chalk'
import {ping} from './utils/dbcon.js'
const green = chalk.green

switch (true) {
  //server
  case argv.indexOf('-s') > 1:
    await ping()
    getTelemetry('isHeadless')
    break
  //client to remote server
  case argv.indexOf('-c') > 1:
    client()
    break
  //local only
  case argv.indexOf('-l') > 1:
    getTelemetry()
    break

  default:
    console.log(`${chalk.yellowBright.bgBlack('nssm accepts one of 3 options:')}
    ${green('-s')} server mode for database logging
    ${green('-c')} client mode for readding and monitoring remotely
    ${green('-l')} local mode for monoitoring locally without logging`)
    process.exit(0)
    break
}
