const validate = require('../../../lib')

const suggestOptions = async (options) => {
    const result = await validate(options?.filePath, options?.source)
    return {
        ...options,
        filePath: options.filePath || answer?.filePath,
        isValid: result?.isValid,
        validDocuments: result?.validDocuments,
    }
}

module.exports = suggestOptions
