import chalk from 'chalk'
import {log} from 'console'
import processList from './dispProcs.js'
const alert2 = chalk.bgRedBright.whiteBright.bold
const alert = chalk.bgHex('#ffaf99f0').black
const warn = chalk.yellow.bgBlack
const info = chalk.black.bgWhiteBright


const dispTelemetry = (data) => {
    console.log('data: ', data);
const {time,meta,usedMem,freeMem,cpu,processes,totalMem} = data
console.clear()
log(`Hostname:\t ${chalk.greenBright(meta.hostname)}
Total Mem:\t ${totalMem}M
Used Mem:\t ${(usedMem * 100).toFixed(2)}%
Free Mem:\t ${freeMem}M
CPU Usage:\t ${(cpu * 100).toFixed(2)}%
Time:\t\t ${chalk.magenta(time)}
-------------------------------------------------
-------------------------------------------------`)

switch (true) {
  case usedMem > 0.85:
    log(alert2(`\xa0\xa0Mem use getting critical ${usedMem}\xa0\xa0`))
    break
  case usedMem > 0.7:
    log(alert(`\xa0\xa0High mem use!! ${usedMem}\xa0\xa0`))
    break
  case usedMem > 0.5:
    log(warn(`\xa0\xa0Mem use getting high\xa0\xa0`))
    break
  default:
    break
}

switch (true) {
  case cpu > 0.85:
    log(alert2(`\xa0\xa0CPU use getting critical ${cpu}\xa0\xa0`))
    break
  case cpu > 0.7:
    log(alert(`\xa0\xa0High CPU use!! ${cpu}\xa0\xa0`))
    break
  case cpu > 0.5:
    log(warn(`\xa0\xa0CPU use getting high\xa0\xa0`))
    break
  default:
    break
}
if (processes) {
  processList(data)
}

}

export default dispTelemetry