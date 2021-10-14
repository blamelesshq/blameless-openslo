const processMultipleDocumentsFromDirectory = require('./utils/processMultipleFilesFromDir')
const validateMultiple = require('./utils/validateMultipleFilesFromDir')
const getContentFromGithubRepo = require('./utils/getContentFromGithubRepository')
const validateGithubMultiple = require('./utils/validateGithubMultiple')

const validate = async (filePath, source) => {
    if (source && source === 'github') {
        const remoteFiles = await getContentFromGithubRepo(filePath)
        return validateGithubMultiple(remoteFiles)
    }

    if (source && source === 'local') {
        const files = processMultipleDocumentsFromDirectory(filePath)
        return validateMultiple(files)
    }
}

module.exports = validate
