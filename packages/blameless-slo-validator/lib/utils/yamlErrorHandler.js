const chalk = require('chalk')
const log = console.log
const warning = chalk.keyword('orange')

const yamlErrorHandler = (errorType, errorMsg, errorOccuredAt) => {
    log(warning('\n========================================================'))
    log(
        warning(
            `${
                errorType &&
                errorType.toUpperCase() &&
                errorType.toUpperCase().padStart(40, ' ')
            } WAS FOUND!`
        )
    )
    log(warning('========================================================'))
    log(
        warning(
            `* ${
                errorType && errorType.toUpperCase()
            } was found at ${errorOccuredAt} yaml specification. Please fix ${
                errorType && errorType
            }.\n`
        )
    )

    log(warning(`${errorMsg}\n`))
}

module.exports = yamlErrorHandler
