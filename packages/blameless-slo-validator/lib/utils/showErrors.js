const logger = require('./logger')

const showErrors = (errors, docType) => {
    if (errors && errors.length) {
        logger.error(
            `========== Blameless ${docType} Validation ${
                errors.length > 1 ? 'Errors' : 'Error'
            }  ==========`
        )
        errors.forEach((error, index) =>
            logger.error(`${[index + 1]}: ${error.message}`)
        )
        return false
    }
    if (!errors) {
        logger.success(
            `========== Blameless ${docType} Validated Successfully ==========`
        )
        return 'Valid!'
    }
}

module.exports = showErrors
