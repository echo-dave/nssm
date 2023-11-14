const parseArgs = (argvLength, help) => {
  const regex = /^(?:-s\s)(cpu|mem)=(\.{0,1}\d{1,2})/
  const regex2 = /(.mem|.cpu)=(\.{0,1}\d{1,2})$/
  const string = process.argv.slice(2).join(' ')
  const inputArgsOption1 = string.match(regex)
  const inputArgsOption2 = string.match(regex2)
  // console.log('args: ', string)
  // console.log('input: ', inputArgsOption1, inputArgsOption2)
  let memThreshold
  let cpuThreshold
  try {
    if (inputArgsOption1[1] === 'mem') {
      memThreshold = Number(inputArgsOption1[2])
    } else cpuThreshold = Number(inputArgsOption1[2])
    argvLength -= 1

    if (argvLength === 4) {
      if (inputArgsOption1[1] === 'cpu') {
        memThreshold = Number(inputArgsOption2[2])
      } else cpuThreshold = Number(inputArgsOption2[2])
      argvLength -= 1
    }
  } catch (e) {
    ;(async () => {
      const { default: help } = await import('./argHelpInfo.js')
      help()
    })()
  }
  return {
    memThreshold: memThreshold > 1 ? 0.5 : memThreshold,
    cpuThreshold: cpuThreshold > 1 ? 0.5 : memThreshold,
    argvLength,
  }
}

export default parseArgs
