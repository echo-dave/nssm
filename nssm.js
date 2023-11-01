#!/usr/bin/env node
import { argv, cpuUsage } from 'node:process'
import getTelemetry from './utils/getTelemetry.js'
import client from './client.js'
import chalk from 'chalk'
import {ping} from './utils/dbcon.js'
import parseArgs from './utils/parseArgs.js'
const green = chalk.green
const argvLength = argv.length
const thresholds = argvLength > 3 && argv[2] === '-s' ? parseArgs(argvLength, help) : {memThreshold:.5,cpuThreshold:.5}
// process.exit()
// process.exit()
switch (true) {
  //server
  case argv.indexOf('-s') === 2 && thresholds.argvLength === 3:
    await ping()
    getTelemetry(thresholds, 'isHeadless')
    break
  //client to remote server
  case argv.indexOf('-c') === 2 && argvLength === 3:
    client()
    break
  //local only
  case argv.indexOf('-l') === 2:
    getTelemetry(thresholds)
    break

  default:
    help()
    break
}

function help() {
  console.log(`${chalk.yellowBright.bgBlack('nssm accepts one of 3 options:')}
    
    ${green('-s')} server mode for database logging
    
    ${green('-c')} client mode for reading and monitoring remotely
    
    ${green('-l')} local mode for monitoring locally without logging
      
      ${green('-p')} optional with local ${green('-l')} to force process monitoring
      
    ie: ./nssm -l -p `)
    process.exit(0)
}