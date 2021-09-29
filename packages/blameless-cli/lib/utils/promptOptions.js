const inquirer = require('inquirer')
const validate = require('@blamelesshq/blameless-slo-validator')
const processFlow = require('./processFlow')

const suggestOptions = async (options) => {
    const blamelessInitialQuestion = []
    if (!options.filePath) {
        blamelessInitialQuestion.push({
            type: 'input',
            name: 'filePath',
            message: 'Please provide path: ',
        })
    }

    const answer = await inquirer.prompt(blamelessInitialQuestion)
    const result = validate(answer?.filePath || options?.filePath)

    return {
        ...options,
        filePath: options.filePath || answer?.filePath,
    }
}

module.exports = suggestOptions
