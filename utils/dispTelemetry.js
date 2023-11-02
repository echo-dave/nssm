import{cpus, freemem, totalmem, hostname, type, version} from 'node:os'
import chalk from 'chalk'
import {log} from 'console'
import processList from './dispProcs.js'
const alert2 = chalk.bgRedBright.whiteBright.bold
const alert = chalk.bgYellow.bold
const warn = chalk.yellow.bgBlack
const info = chalk.black.bgWhiteBright


const dispTelemetry = (data) => {
    console.log('data: ', data);
const {time,meta,usedMem,freeMem,cpu,processes} = data
console.clear()
log(`Hostname:\t ${chalk.greenBright(meta.hostname)}
Total Mem: \t ${(totalmem / 1_000_000).toFixed(2)}M
Used Mem:\t ${(usedMem * 100).toFixed(2)}%
Free Mem:\t ${freeMem}M
CPU Usage:\t ${cpu * 100}%
Time:\t\t ${chalk.magenta(time)}
-------------------------------------------------
-------------------------------------------------`)
if (processes) {
  processList(data)
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

}

export default dispTelemetry