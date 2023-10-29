import { spawn } from 'node:child_process'
const ps = spawn('ps', ['-axcmo', '%cpu,%mem,pid,time,user,comm'])
const head = spawn('head', ['-n', '10'])
const awk = spawn('awk', [`{print $1"\t"$2"\t"$3"\t"$4"\t"$5" "$6" "$7" "$8}`])
import { log } from 'node:console'

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
    // dbObject = []
    // cpuObject = []

    for (let i = 0; i < data.length - 1; i++) {
      data[i] = data[i].split(',')
      let buildArray = []
      for (let j = 0; j < data[i].length; j++) {
        buildArray.push({ [labels[j]]: data[i][j] })
      }

      sortProcess === 'mem'
        ? dbObject.push(buildArray)
        : cpuObject.push(buildArray)
    }

    //format terminal output
    if (!isHeadless) {
      dbObject.forEach((row) => {
        log(
          `${row[0].cpu}\t${row[1].mem}\t${row[2].pid}\t${row[3].time.padEnd(
            8,
            ' '
          )}\t${row[4].user.padEnd(8, ' ')}\t${row[5].process}`
        )
      })
    }
    sortProcess === 'mem' ? dbObject.shift() : cpuObject.shift()
    // log(cpuObject)
  })
  // sortProcess === 'cpu' ? log('cpu: \n', cpuObject) : log('mem: \n', dbObject)
  return (await sortProcess) === 'mem' ? dbObject : cpuObject

  processSort.stderr.on('data', (data) => console.error(data.toString()))
}

export { processList }
