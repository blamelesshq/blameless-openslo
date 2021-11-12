const logger = require('./utils/logger')
const documentProcesorByType = require('./utils/documentProcessorByType')
const _ = require('lodash')
// const { listOfMinimalRequiredDocuments } = require('../lib/config/constants')
const waterfallSloCreateHandler = require('./utils/waterfallSloCreateHandler')

// const hasMinimumRequirements = (docs) => {
//     return listOfMinimalRequiredDocuments.every((property) => property in docs)
// }

const createResources = async (options) => {
    if (options && !options.isValid && !options?.validDocuments) {
        logger.warn('YAML file is not valid. Please update and try again')
        return
    }

    if (
        options &&
        options.isValid &&
        options.filePath &&
        _.size(options?.validDocuments) == 1
    ) {
        const document = options?.validDocuments?.[0]
        const documentType = document && document.kind
        documentProcesorByType(
            documentType && documentType.toLowerCase(),
            document
        )
    }

    if (
        (options &&
            options.isValid &&
            options?.validDocuments &&
            _.size(options?.validDocuments) > 1) ||
        (options &&
            !options.isValid &&
            options?.validDocuments &&
            _.size(options?.validDocuments) > 1)
    ) {
        waterfallSloCreateHandler(options?.validDocuments)
        // waterfallErrorBudgetPolicyCreateHandler(options?.validDocuments)
    }
}

module.exports = createResources
