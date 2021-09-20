const inquirer = require('inquirer')
const validate = require('../../../blameless-slo-validator/lib')

const suggestOptions = async (options) => {
    const blamelessInitialQuestion = []
    if (!options.filePath) {
        blamelessInitialQuestion.push({
            type: 'input',
            name: 'filePath',
            message: 'Please provide path to your .yaml file: ',
            default: './lib/specs/',
        })
    }

    const response = await inquirer.prompt(blamelessInitialQuestion)
    const result = validate(response?.filePath)
    const documentType = result?.value?.kind

    return {
        ...options,
        filePath: response.filePath,
    }
}

module.exports = suggestOptions
