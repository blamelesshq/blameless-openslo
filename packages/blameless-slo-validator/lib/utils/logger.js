const chalk = require('chalk')

const log = (title, message, color = 'blue') =>
    console.log(`${chalk[color].bold(title)} : ${chalk[color](message)}`)

const logger = {
    info: (message) => log('[BLAMELESS] INFO', message, 'blue'),
    warn: (message) => log('[BLAMELESS] WARNING', message, 'yellow'),
    error: (message) => log('[BLAMELESS] ERROR', message, 'red'),
    success: (message) => log('[BLAMELESS] SUCCESS', message, 'green'),
    red: (message) => console.log(chalk.red(message)),
    help: (message) => log('[BLAMELESS] HELP', message, 'yellow'),
}

module.exports = logger
