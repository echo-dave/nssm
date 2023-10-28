import { spawn } from 'node:child_process';
const ps = spawn('ps', ['-axcmo', '%cpu,%mem,pid,time,user,comm']);
const head = spawn('head', ["-n", "10"]);
const awk = spawn('awk', [`{print $1"\t"$2"\t"$3"\t"$4"\t"$5" "$6" "$7" "$8}`]);
// const csvMem = spawn('./psMem.bash');
// const csvCPU = spawn('./psCPU.bash');
import { error, log } from 'node:console';

function processList(sortProcess) {
    // ps.stdout.on('data', procs => {
    //     head.stdin.write(procs)
    // })
    
    // head.stdout.on('data', procs => {
    //     procs = procs.toString()
    // })
    
    // awk.stdout.on('data', procs => {
    //     console.log(`awk buffer: ${procs}`);
    //     procs = procs.toString()
    //     log(procs)
    // })
    
    
    // ps.stderr.on('data', (data) => {
    //     console.error(`ps stderr: ${data}`);
    // });
    // awk.stderr.on('data', data => console.error('awks err: ', data.toString()))
    const processSort = sortProcess === "cpu" ? spawn('scripts/psCPU.bash') : spawn('scripts/psMem.bash');
    // if (sortProcess === "mem") const processSort =  spawn('./psMem.bash');
    // if (sortProcess === "cpu") const processSort = spawn('./psCPU.bash');
    // sortProcess === "cpu" ? processSort = csvCPU : processSort = csvMem
    // log("sorting by: ", processSort)
    processSort.stdout.on('data', data => {
        data = data.toString()
        // log(`data: ${data}`)
        //    log(`sting data \n ${data}`)
        //    let dataArray = data.split(',')
        //    data[1] = data[1].split('\t')
        data = data.split('\n')
        //    data[1] = data[1].split(',')
        const labels = ["cpu", "mem", "pid", "time", "user", "process"]
        let dbObject = []
        data.shift()
        for (let i = 0; i < data.length-1; i++) {
            data[i] = data[i].split(',')
            let buildArray = []
            for (let j = 0; j < data[i].length; j++) {
                buildArray.push({[labels[j]]: data[i][j]})
            }
            dbObject.push(buildArray)
        }; 
        log(dbObject) 


        //    log(`CSV: \n`, data)

        })

    processSort.stderr.on('data', data => console.error(data.toString))
}

processList()

// export {processList}