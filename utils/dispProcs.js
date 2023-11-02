import { log } from 'node:console'
import chalk from 'chalk'

const procs = async (data) => {
  const labels = ['cpu', 'mem', 'pid', 'time', 'user', 'process']
  let headers = {}
  labels.forEach((el) => (headers[el] = el))

  //   sortProcess === 'mem' ? dbObject.unshift(headers) : cpuObject.unshift(headers)

  const logProcs = (dataSet) => {
    log(`\xa0\xa0Sorting by ${dataSet} useage`)
    try {
    data.processes[dataSet].forEach((row, i) => {
      if (i == 0) {
        log(
          chalk.greenBright.underline(
            `cpu\tmem\tpid\t${'time'.padEnd(8, ' ')}\t${'user'.padEnd(
              8,
              ' '
            )}\tprocess`
          )
        )
      }
      log(
        `${row.cpu}\t${row.mem}\t${row.pid}\t${row.time.padEnd(
          8,
          ' '
        )}\t${row.user.padEnd(8, ' ')}\t${row.process}`
      )
    })
  } catch(e) {console.warn(e)}
  
  }

  if (data.processes?.mem) logProcs('mem')
  if (data.processes?.cpu) logProcs('cpu')

  //   return (await sortProcess) === 'mem' ? dbObject : cpuObject
}

export default procs
