import getHostnames from './api/getHostnames.js'
import getClientData from './api/clientTsData.js'
import inquirer from 'inquirer'

export default async () => {
  const hostnames = await getHostnames()

  const inquirerPrompt = async () => {
    return await inquirer.prompt([
      {
        type: 'list',
        name: 'hosts',
        message: 'Which host do you want to monitor?',
        choices: hostnames,
      },
    ])
  }

  if (hostnames?.length > 1) {
    const toMonitor = await inquirerPrompt()
    getClientData(toMonitor.hosts)
  } else getClientData()
}