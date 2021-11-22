const logger = require('../../lib/utils/logger')

const documentProcesorByType = require('./utils/documentProcessorByType')
// const { listOfMinimalRequiredDocuments } = require('../lib/config/constants')
const waterfallSloCreateHandler = require('./utils/waterfallSloCreateHandler')

// const hasMinimumRequirements = (docs) => {
//     return listOfMinimalRequiredDocuments.every((property) => property in docs)
// }

const _objSize = (obj) => {
    let size = 0
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++
        }
    }
    return size
}

const createResources = async (options) => {
    if (options && !options.isValid && !options?.validDocuments) {
        logger.warn(
            `There is no .YAML files found at specified path\nPlease make sure that path ${options?.filePath} is correct`
        )
        return
    }

    if (
        options &&
        options.isValid &&
        options.filePath &&
        _objSize(options?.validDocuments) == 1
    ) {
        const [document] =
            options?.validDocuments[Object.keys(options?.validDocuments)]
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
            _objSize(options?.validDocuments) > 1) ||
        (options &&
            !options.isValid &&
            options?.validDocuments &&
            _objSize(options?.validDocuments) > 1)
    ) {
        waterfallSloCreateHandler(options?.validDocuments)
        // waterfallErrorBudgetPolicyCreateHandler(options?.validDocuments)
    }
}

module.exports = createResources
