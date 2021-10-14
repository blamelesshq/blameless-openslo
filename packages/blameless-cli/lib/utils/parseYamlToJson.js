const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const parseYamlToJson = (filePath) => {
    if (!filePath || !filePath.includes('.yaml')) {
        return false
    }
    try {
        const doc = yaml.load(fs.readFileSync(filePath, 'utf8'))
        return JSON.parse(JSON.stringify(doc))
    } catch (e) {
        console.log(e)
    }
}

module.exports = parseYamlToJson
