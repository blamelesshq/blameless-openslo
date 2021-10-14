const logger = require('./utils/logger')
const parseYamlToJson = require('./utils/parseYamlToJson')
const documentProcesorByType = require('./utils/documentProcessorByType')
const _ = require('lodash')
const { listOfMinimalRequiredDocuments } = require('../lib/config/constants')
const waterfallSloCreateHandler = require('./utils/waterfallSloCreateHandler')

const hasMinimumRequirements = (docs) => {
    return listOfMinimalRequiredDocuments.every((property) => property in docs)
}

const createResources = async (options) => {
    if (options && !options.isValid && _.size(options?.validDocuments) == 1) {
        logger.warn('YAML file is not valid. Please update and try again')
        return
    }

    if (
        options &&
        options.isValid &&
        options.filePath &&
        _.size(options?.validDocuments) <= 1
    ) {
        const document = parseYamlToJson(options.filePath)
        const documentType = document && document.kind

        documentProcesorByType(
            documentType && documentType.toLowerCase(),
            document
        )
    }

    if (
        options &&
        !options.isValid &&
        options?.validDocuments &&
        _.size(options?.validDocuments) > 1
    ) {
        const hasMinRequirements = hasMinimumRequirements(
            options && options?.validDocuments
        )

        if (hasMinRequirements) {
            waterfallSloCreateHandler(options && options?.validDocuments)
        } else {
            logger.warn(
                `The minimum requirements were not met, make sure you have the following types of documents: ${listOfMinimalRequiredDocuments}`
            )
        }
    }
}

module.exports = createResources
