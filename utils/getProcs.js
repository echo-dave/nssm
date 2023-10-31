import { spawn } from 'node:child_process'
const ps = spawn('ps', ['-axcmo', '%cpu,%mem,pid,time,user,comm'])
const head = spawn('head', ['-n', '10'])
const awk = spawn('awk', [`{print $1"\t"$2"\t"$3"\t"$4"\t"$5" "$6" "$7" "$8}`])
import { log } from 'node:console'
import chalk from 'chalk'


async function processList(sortProcess, osType, isHeadless) {
  let dbObject = []
  let cpuObject = []

  let processSort
  if (osType === 'Linux') {
    processSort =
      sortProcess === 'cpu'
        ? spawn('scripts/psCPU_unbuntu.bash')
        : spawn('scripts/psMem_unbuntu.bash')
  } else {
    processSort =
      sortProcess === 'cpu'
        ? spawn('scripts/psCPU.bash')
        : spawn('scripts/psMem.bash')
  }

  processSort.stdout.on('data', (data) => {
    data = data.toString()
    data = data.split('\n')

    const labels = ['cpu', 'mem', 'pid', 'time', 'user', 'process']
    let headers = {}
    labels.forEach(el => headers[el] = el)
    // dbObject = []
    // cpuObject = []

    for (let i = 1; i < data.length - 1; i++) {
      data[i] = data[i].split(',')
      
      // for (let j = 0; j < data[i].length; j++) {
        // buildArray.push({ [labels[j]]: data[i][j] })
        let buildObject = {
            cpu: Number(data[i][0]),
            mem: Number(data[i][1]),
            pid: Number(data[i][2]),
            time: data[i][3],
            user: data[i][4],
            process: data[i][5],
         }
        
      

      sortProcess === 'mem'
        ? dbObject.push(buildObject)
        : cpuObject.push(buildObject)
    }

    //format terminal output
    if (!isHeadless) {
      sortProcess === 'mem' ? dbObject.unshift(headers) : cpuObject.unshift(headers)
      dbObject.forEach((row, i) => {
        const logFormat = `${row.cpu}\t${row.mem}\t${row.pid}\t${row.time.padEnd(
          8,
          ' '
        )}\t${row.user.padEnd(8, ' ')}\t${row.process}`

        if (i == 0) {
          log(chalk.greenBright.underline(logFormat))
        } else log(logFormat)
      })
    }
    // sortProcess === 'mem' ? dbObject.shift() : cpuObject.shift()
    // log(cpuObject)
  })
  // sortProcess === 'cpu' ? log('cpu: \n', cpuObject) : log('mem: \n', dbObject)
  return (await sortProcess) === 'mem' ? dbObject : cpuObject

  processSort.stderr.on('data', (data) => console.error(data.toString()))
}

export { processList }
