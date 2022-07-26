const suggestOptions = require('../../lib/utils/promptOptions')
const parseArgsIntoOpt = require('../../lib/utils/getArgsOptions')
const logger = require('../../lib/utils/logger')
const objSize = require('../../lib/utils/objSize')

const documentProcesorByType = require('./utils/documentProcessorByType')
const waterfallSloDeleteHandler = require('./utils/waterfallSloDeleteHandler')

const deleteResources = async (options) => {
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
        objSize(options?.validDocuments) == 1
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
            objSize(options?.validDocuments) > 1) ||
        (options &&
            !options.isValid &&
            options?.validDocuments &&
            objSize(options?.validDocuments) > 1)
    ) {
        waterfallSloDeleteHandler(options?.validDocuments)
    }
}


const cli = async (args) => {
    let options = parseArgsIntoOpt(args)
    options = await suggestOptions(options)
    await deleteResources(options)
}

module.exports = cli
