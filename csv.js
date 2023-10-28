import { spawn } from 'node:child_process'
const ps = spawn('ps', ['-axcmo', '%cpu,%mem,pid,time,user,comm'])
const head = spawn('head', ['-n', '10'])
const awk = spawn('awk', [`{print $1"\t"$2"\t"$3"\t"$4"\t"$5" "$6" "$7" "$8}`])
import { log } from 'node:console'

function processList(sortProcess) {
  let processSort =
    sortProcess === 'cpu'
      ? spawn('scripts/psCPU.bash')
      : spawn('scripts/psMem.bash')
  function runScripts() {
    processSort.stdout.on('data', (data) => {
      data = data.toString()
      data = data.split('\n')
      const labels = ['cpu', 'mem', 'pid', 'time', 'user', 'process']
      let dbObject = []
      for (let i = 0; i < data.length - 1; i++) {
        data[i] = data[i].split(',')
        let buildArray = []
        for (let j = 0; j < data[i].length; j++) {
          buildArray.push({ [labels[j]]: data[i][j] })
        }
        dbObject.push(buildArray)
      }
      //format terminal output
      dbObject.forEach((row) => {
        log(
          `${row[0].cpu}\t${row[1].mem}\t${row[2].pid}\t${row[3].time.padEnd(
            8,
            ' '
          )}\t${row[4].user.padEnd(8, ' ')}\t${row[5].process}`
        )
      })
      dbObject.shift()
      // log(dbObject)
    })
  }
  runScripts()
  processSort.stderr.on('data', (data) => {
    log('trying')
    processSort =
      sortProcess === 'cpu'
        ? spawn('scripts/psCPU_unbuntu.bash')
        : spawn('scripts/psMem_unbuntu.bash')
    runScripts()
    processSort.stderr.on('data', (data) => console.error(data.toString()))
  })
}

export { processList }
