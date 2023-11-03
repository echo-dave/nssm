import chalk from 'chalk'
const green = chalk.green

export default () => {
  console.log(`${chalk.yellowBright.bgBlack('nssm accepts one of 3 options:')}
      Usage: ./nssm.js [-s mem= cpu=]] | -c | -l [-p]

      ${green('-s')} server mode for database logging
         ${green('mem')} adjust the memory threshold ie mem=.4 default .5
         ${green('cpu')} adjust the cpu threshold ie cpu=.75 defualt .5
      
      ${green('-c')} client mode for reading and monitoring remotely
      
      ${green('-l')} local mode for monitoring locally without logging
         ${green('-p')} optional with local ${green(
    '-l'
  )} to force process monitoring

      ${green('ctrl-N')} to swap servers monitored if you have more than one 
      already logged in the database.
        
      ie: ./nssm.js -l -p 
          ./nssm.js -s mem=.6 cpu=.35`)
  process.exit(0)
}
