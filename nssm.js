#!/usr/bin/env node
import { argv } from 'node:process'
// import getTelemetry from './utils/getTelemetry.js'
// import client from './client.js'
// import { ping } from './utils/dbcon.js'
import parseArgs from './utils/parseArgs.js'
const argvLength = argv.length
const thresholds =
  argvLength > 3 && argv[2] === '-s'
    ? parseArgs(argvLength)
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
  case argv.slice(2).join(' ').match(/^(-l$|-l -p)$/) !== null:
    ;(async () => {
      const { default: getTelemetry } = await import('./utils/getTelemetry.js')
      getTelemetry(thresholds)
    })()
    break

  default:
    (async() =>{
    const {default: help} = await import('./utils/argHelpInfo.js')
    help()
    })()
    break
}


