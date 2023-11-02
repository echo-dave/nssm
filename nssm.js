#!/usr/bin/env node
import { argv } from 'node:process'
// import getTelemetry from './utils/getTelemetry.js'
// import client from './client.js'
import chalk from 'chalk'
// import { ping } from './utils/dbcon.js'
import parseArgs from './utils/parseArgs.js'
const green = chalk.green
const argvLength = argv.length
const thresholds =
  argvLength > 3 && argv[2] === '-s'
    ? parseArgs(argvLength, help)
    : { memThreshold: 0.5, cpuThreshold: 0.5, argvLength: argvLength }

switch (true) {
  //server
  case argv.indexOf('-s') === 2 && thresholds.argvLength === 3:
    ;(async () => {
      const { ping } = await import('./utils/dbcon.js')
      await ping()
      const { default: getTelemetry } = await import('./utils/getTelemetry.js')
      getTelemetry(thresholds, 'isHeadless')
    })()
    break
  //client to remote server
  case argv.indexOf('-c') === 2 && argvLength === 3:
    ;(async () => {
      const { default: client } = await import('./client.js')
      client()
    })()
    break
  //local only
  case argv.indexOf('-l') === 2:
    ;(async () => {
      const { default: getTelemetry } = await import('./utils/getTelemetry.js')
      getTelemetry(thresholds)
    })()
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
      
      ${green('-p')} optional with local ${green(
    '-l'
  )} to force process monitoring
      
    ie: ./nssm -l -p `)
  process.exit(0)
}
