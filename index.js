import { cpus, loadavg, freemem, totalmem, hostname } from 'node:os'
import chalk from 'chalk'
import { processList } from './csv.js'
import { log } from 'node:console'
const alert2 = chalk.bgRedBright.whiteBright.bold
const alert = chalk.bgYellow.bold
const warn = chalk.yellow.bgBlack
const info = chalk.black.bgWhiteBright

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
  return { usedMem: usedMemory.toFixed(4), freeMem: freeMemory }
}

const systemUsage = async () => {
  const timeStamp = new Date()
  const cpu = await getCpuUsage()
  const ram = await getMemUsage()
  ram.freeMem = (ram.freeMem / 1_000_000).toFixed(2) //convert to megabytes from bytes
  return {
    usedMem: ram.usedMem,
    freeMem: ram.freeMem,
    cpu: cpu.cpu,
    time: timeStamp,
  }
}
setInterval(async () => {
  const report = await systemUsage()
  report.hostname = hostname()

  const { usedMem, freeMem, cpu, time } = report
  console.clear()

report.hostname = hostname()
//   log(report)
  log(`Hostname:\t ${chalk.greenBright(hostname())}
Used Mem:\t ${usedMem*100}%
Free Mem:\t ${freeMem}M
CPU Usage:\t ${cpu*100}%
Time:\t\t ${chalk.magenta(time)}
-------------------------------------------------
-------------------------------------------------`)

  switch (true) {
    case usedMem > 0.5:
      log(info(' Process logging for ram '))
      processList('mem')
    case usedMem > 0.85:
      log(alert2(`Ram use getting critical ${usedMem}`))
      break
    case usedMem > 0.7:
      log(alert(`High ram use!! ${usedMem}`))
      break
    case usedMem > 0.5:
      log(warn(`Ram use getting high`))
      break
    default:
      break
  }

  switch (true) {
    case cpu > 0.5:
      log(info(' Process logging for cpu '))
      processList('cpu')
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
  if (cpu > 0.6) log(warn(`high cpu use!! ${cpu}`))

}, 2000)
