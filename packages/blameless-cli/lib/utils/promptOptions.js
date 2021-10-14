const inquirer = require('inquirer')
const validate = require('@blamelesshq/blameless-slo-validator')
// const validate = require('../../../blameless-slo-validator/lib/')

const suggestOptions = async (options) => {
    const blamelessInitialQuestion = []
    if (!options.filePath) {
        blamelessInitialQuestion.push({
            type: 'input',
            name: 'filePath',
            message: 'Please provide path: ',
        })
    }

    //const answer = await inquirer.prompt(blamelessInitialQuestion)
    const result = validate(options?.filePath)
    return {
        ...options,
        filePath: options.filePath || answer?.filePath,
        isValid: result?.isValid,
        validDocuments: result?.validDocuments,
    }
}

module.exports = suggestOptions
