import {cpus, loadavg, freemem, totalmem } from 'node:os';
import chalk from 'chalk';
// import {processList} from "./csv.js";
import { error, log } from 'node:console';
import { truncate } from 'node:fs';
const alert2 = chalk.bgRedBright.bold
const alert = chalk.bgYellow.bold
const warn = chalk.yellow.bgBlack

// const avgLoad = setInterval(()=>console.log(loadavg()), 2000)
// console.log(cpus())
const getCpuUsage = async () => {
    const cpuData = cpus()
    let accumulator = {user:0,sys:0,idle:0}
    cpuData.forEach((el, i)=> {
        accumulator.user +=  el.times.user
        accumulator.sys += el.times.sys
        accumulator.idle += el.times.idle
    });
    const {user, sys, idle} = accumulator
    const cpuUsed = (user + sys) / (user + sys + idle)
    return {cpu: cpuUsed.toFixed(4)}
} 

const getMemUsage = async () => {
    const freeMemory = freemem()
    const totalMem = totalmem()
    const usedMemory = (totalMem - freeMemory) / totalMem
    return {usedMem: usedMemory.toFixed(4), freeMem: freeMemory}
}

const systemUsage = async () =>  {
    const timeStamp = new Date()
    const cpu = await getCpuUsage()
    const ram = await getMemUsage()
    ram.freeMem = (ram.freeMem / 1_000_000).toFixed(2) //convert to megabytes from bytes   
    return {usedMem: ram.usedMem, freeMem: ram.freeMem, cpu: cpu.cpu, time: timeStamp}
}


setInterval(async ()=>{
    const report =  await systemUsage()
    const {usedMem, freeMem, cpu, time} = report
    
    switch (true) {
        case usedMem > .85:
            log(alert2(`Ram use getting critical ${usedMem}`))
            break
        case usedMem > .70 :
            log(alert(`High ram use!! ${usedMem}`))
            break
        case usedMem > .50 :
            log(warn(`Ram use getting high`))
            break
        default:
            break;
    }
        // processList("mem")
    if (cpu > .6) log(warn(`high cpu use!! ${cpu}`))
    
    log(report)
   },2000)


