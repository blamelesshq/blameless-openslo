const Listr = require('listr')
const chalk = require('chalk')

const createResources = async (options) => {
    const tasks = new Listr()

    await tasks.run()
    console.log(chalk.green.bold('DONE'))
    return true
}

module.exports = createResources
