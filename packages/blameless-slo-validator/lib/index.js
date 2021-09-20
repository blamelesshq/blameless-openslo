const fs = require('fs')
const { logger, showErrors } = require('./utils')
const yaml = require('js-yaml')
const sliSchema = require('./schema/sliSchema')
const sloSchema = require('./schema/sloSchema')
const userJorneySchema = require('./schema/userJourneySchema')
const serviceSchema = require('./schema/serviceSchema')
const errorBudgetPolicySchema = require('./schema/errorBudgetPolicySchema')
const alertPolicySchema = require('./schema/alertPolicySchema')
const alertNotificationSchema = require('./schema/alertNotificationSchema')
const alertConditionSchema = require('./schema/alertConditionSchema')

const validatePath = (path) => {
    return fs.existsSync(path)
}

const validate = (filePath) => {
    if (!filePath) {
        logger.error(
            'Missing argument: Either filename or file filePath is required'
        )
        return 'Invalid'
    }
    const isPath = typeof filePath === 'string'

    if (isPath && !validatePath(filePath)) {
        logger.error(
            'Source path is not valid. Please provide valid source file path'
        )
        return 'Invalid'
    }

    const processedDocument = yaml.load(fs.readFileSync(filePath, 'utf8'))
    const processedDocumentType = processedDocument?.kind
    let result
    switch (processedDocumentType) {
        case 'SLI':
            result = sliSchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        case 'SLO':
            result = sloSchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        case 'UserJourney':
            result = userJorneySchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        case 'Service':
            result = serviceSchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        case 'ErrorBudgetPolicy':
            result = errorBudgetPolicySchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        case 'AlertPolicy':
            result = alertPolicySchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        case 'AlertNotificationTarget':
            result = alertNotificationSchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        case 'AlertCondition':
            result = alertConditionSchema.validate(processedDocument, {
                abortEarly: false,
            })
            break
        default:
            break
    }

    const { error, value } = result

    if ((error && error !== 'Invalid') || value) {
        showErrors(error?.details)
    }

    return {
        isValid: error?.details ? false : true,
        value: error?.details ? null : value,
        errors: error?.details ? error?.details : null,
    }
}

module.exports = validate
