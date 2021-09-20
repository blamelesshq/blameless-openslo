const logger = require('./logger')

const showErrors = (errors) => {
    if (errors && errors.length) {
        logger.error(
            `========== Blameless SLO Validation ${
                errors.length > 1 ? 'Errors' : 'Error'
            }  ==========`
        )
        errors.forEach((error, index) =>
            logger.error(`${[index + 1]}: ${error.message}`)
        )
        return -1
    }
    if (!errors) {
        logger.success(
            '========== Blameless SLO Validated Successfully =========='
        )
        return 'Valid!'
    }
}

module.exports = showErrors
