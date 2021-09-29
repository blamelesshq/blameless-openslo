const processMultipleDocumentsFromDirectory = require('./utils/processMultipleFilesFromDir')
const validateMultiple = require('./utils/validateMultipleFilesFromDir')

const validate = (filePath) => {
    const files = processMultipleDocumentsFromDirectory(filePath)

    return validateMultiple(files)
}

module.exports = validate
