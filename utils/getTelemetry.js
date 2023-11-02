import { cpus, freemem, totalmem, hostname, type, version } from 'node:os'
import chalk from 'chalk'
import { processList } from './getProcs.js'
import { log } from 'node:console'
import sendData from '../api/tsData.js'
const alert2 = chalk.bgRedBright.whiteBright.bold
const alert = chalk.bgYellow.bold
const warn = chalk.yellow.bgBlack

const getCpuUsage = async () => {
  const cpuData = cpus()
  let accumulator = { user: 0, sys: 0, idle: 0 }
  cpuData.forEach((el, i) => {
    accumulator.user += el.times.user
    accumulator.sys += el.times.sys
    accumulator.idle += el.times.idle
  })
  const { user, sys, idle } = accumulator
  const cpuUsed = (user + sys) / (user + sys + idle)
  return { cpu: cpuUsed.toFixed(4) }
}

const getMemUsage = async () => {
  const freeMemory = freemem()
  const totalMem = totalmem()
  const usedMemory = (totalMem - freeMemory) / totalMem
  return { usedMem: usedMemory.toFixed(4), freeMem: freeMemory,totalMem: totalMem }
}

const systemUsage = async () => {
  const timeStamp = new Date()
  const cpu = await getCpuUsage()
  const mem = await getMemUsage()
  mem.freeMem = (mem.freeMem / 1_000_000).toFixed(2) //convert to megabytes from bytes
  mem.totalMem = (mem.totalMem / 1_000_000).toFixed(2)  //converting to MB
  return {
    time: timeStamp,
    meta: {},
    usedMem: parseFloat(mem.usedMem), //decimal percent ie .34
    freeMem: parseFloat(mem.freeMem), //in MBs
    totalMem: parseFloat(mem.totalMem),
    cpu: parseFloat(cpu.cpu),
  }
}

let cpuProcs = []
let memProcs = []
export default async (thresholds, isHeadless) => {
  setInterval(async () => {
    const report = await systemUsage()
    report.meta = { hostname: hostname() }
    const { usedMem, freeMem, cpu, time, meta, totalMem } = report
    // report.hostname = hostname()
    //   log(report)
    if (!isHeadless) {
      console.clear()
      log(`Hostname:\t ${chalk.greenBright(meta.hostname)}
OS:\t\t ${type()} \n\t\t ${version()}
Total Mem: \t ${(totalMem / 1_000_000).toFixed(2)}M
Used Mem:\t ${(usedMem * 100).toFixed(2)}%
Free Mem:\t ${freeMem}M
CPU Usage:\t ${cpu * 100}%
Time:\t\t ${chalk.magenta(time)}
-------------------------------------------------
-------------------------------------------------`)
      if (usedMem > thresholds.memThreshold || process.argv.indexOf('-p') > 2) {
        processList('mem', type(), isHeadless)
      }
      switch (true) {
        case usedMem > 0.85:
          log(alert2(`Mem use getting critical ${usedMem}`))
          break
        case usedMem > 0.7:
          log(alert(`High mem use!! ${usedMem}`))
          break
        case usedMem > 0.5:
          log(warn(`Mem use getting high`))
          break
        default:
          break
      }
      if (cpu > thresholds.cpuThreshold || process.argv.indexOf('-p') > 2) {
        processList('cpu', type(), isHeadless)
      }
      switch (true) {
        case cpu > 0.85:
          log(alert2(`CPU use getting critical ${cpu}`))
          break
        case cpu > 0.7:
          log(alert(`High CPU use!! ${cpu}`))
          break
        case cpu > 0.5:
          log(warn(`CPU use getting high`))
          break
        default:
          break
      }
    } else {
      report.processes = {}
      if (cpu > thresholds.cpuThreshold) {
        const tmp = await processList('cpu', type(), isHeadless)
        cpuProcs.push(tmp)
        // log("tmp: ",cpuProcs)
        if (cpuProcs.length > 1) {
          // log(chalk.red('cpu \n'))
          report.processes.cpu = cpuProcs.shift()
        }
      }
      if (usedMem > thresholds.memThreshold) {
        const tmp2 = await processList('mem', type(), isHeadless)
        memProcs.push(tmp2)
        // log(chalk.red("tmp: "),memProcs)

        if (memProcs.length > 2) {
          // log(chalk.red('mem \n'))
          report.processes.mem = memProcs.shift()
        }
      }
      if (report.processes && JSON.stringify(report.processes) == '{}')
        delete report.processes
      // console.dir(report, { depth: null, colors: true })
      sendData(report)
    }
  }, 2000)
}
