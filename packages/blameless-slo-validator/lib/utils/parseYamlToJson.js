const yaml = require('js-yaml')
const fs = require('fs')
const yamlErrorHandler = require('../utils/yamlErrorHandler')

const parseYamlToJson = (filePath) => {
    if (!filePath || !filePath.includes('.yaml')) {
        return false
    }

    try {
        const document = yaml.load(fs.readFileSync(filePath, 'utf-8'))
        return JSON.parse(JSON.stringify(document))
    } catch (error) {
        yamlErrorHandler(
            error?.reason,
            error?.mark?.snippet,
            error?.mark?.buffer &&
                error?.mark?.buffer.split('\n') &&
                error?.mark?.buffer.split('\n')[1] &&
                error?.mark?.buffer.split('\n')[1].split(':')[1].trim()
        )
    }
}

module.exports = parseYamlToJson
