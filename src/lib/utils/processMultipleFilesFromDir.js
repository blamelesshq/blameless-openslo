const path = require('path')
const fs = require('fs')
const logger = require('./logger')
const isItYaml = require('./isItYaml')

const validatePath = (path) => {
    return fs.existsSync(path)
}

const processMultipleDocumentsFromDirectory = (filePath) => {
    let yamlDocuments = []
    if (!filePath) {
        logger.error(
            'Missing argument: Either filename or file filePath is required'
        )
        return false
    }

    if (!validatePath(filePath)) {
        logger.error(
            'Source path is not valid. Please provide valid source file path'
        )
        return false
    }

    if (fs.lstatSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach((filename) => {
            const fName = path.parse(filename).name
            const fileExtension = path.parse(filename).ext
            const fileNameWithExtension = `${fName}${fileExtension}`
            const fullPath = `${filePath}/${fileNameWithExtension}`

            if (isItYaml(filename)) {
                yamlDocuments.push({
                    fileNameWithExtension,
                    filePath,
                    fullPath,
                })
            }
        })
    } else {
        const fName = path.parse(filePath).name
        const fileExtension = path.parse(filePath).ext
        const fileNameWithExtension = `${fName}${fileExtension}`
        const fullPath = `${filePath}`
        if (fileExtension.includes('yaml')) {
            yamlDocuments.push({
                fileNameWithExtension,
                filePath,
                fullPath,
            })
        }
    }

    return yamlDocuments
}

module.exports = processMultipleDocumentsFromDirectory
