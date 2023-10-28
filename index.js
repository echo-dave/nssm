import { cpus, loadavg, freemem, totalmem } from 'node:os'
import chalk from 'chalk'
import { processList } from './csv.js'
import { log } from 'node:console'
import sound from 'sound-play'
const alert2 = chalk.bgRedBright.whiteBright.bold
const alert = chalk.bgYellow.bold
const warn = chalk.yellow.bgBlack

let audioAlertAvailable = true
async function audioAlert() {
  function playAlert() {
    sound.play('audio/alert.mp3', function (err) {
      if (err) throw err
    })
  }
  if (audioAlertAvailable == true) {
    playAlert()
    setTimeout(() => {
      playAlert()
    }, 250)
    audioAlertAvailable = false
    setTimeout(() => {
      audioAlertAvailable = true
    }, 300000)
  }
}

// const avgLoad = setInterval(()=>console.log(loadavg()), 2000)
// console.log(cpus())
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
  const { usedMem, freeMem, cpu, time } = report
  console.clear()
  switch (true) {
    case usedMem > 0.5:
      // log('start process logging for ram')
      processList('mem')
      audioAlert()
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
      // log('star process logging for cpu')
      processList('cpu')
      audioAlert()
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
  // processList("mem")
  if (cpu > 0.6) log(warn(`high cpu use!! ${cpu}`))

  log(report)
}, 2000)
