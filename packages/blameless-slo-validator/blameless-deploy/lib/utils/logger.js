const chalk = require('chalk')

const log = (title, message, color = 'blue') =>
    console.log(`${chalk[color].bold(title)} : ${chalk[color](message)}`)

const infoProcesor = (message, errors, color = 'blue') =>
    console.log(`${chalk[color].bold(message)}`, errors)

const logger = {
    info: (message) => log('[BLAMELESS] INFO', message, 'blue'),
    warn: (message) => log('[BLAMELESS] WARNING', message, 'yellow'),
    error: (message) => log('[BLAMELESS] ERROR', message, 'red'),
    success: (message) => log('[BLAMELESS] SUCCESS', message, 'green'),
    infoSuccess: (message) => console.log(chalk.green(message)),
    red: (message) => console.log(chalk.red(message)),
    help: (message) => log('[BLAMELESS] HELP', message, 'yellow'),
    infoError: (message, errors) => infoProcesor(message, errors, 'red'),
}

module.exports = logger
