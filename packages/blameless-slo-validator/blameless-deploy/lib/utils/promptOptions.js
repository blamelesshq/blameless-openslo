//const validate = require('@blamelesshq/blameless-slo-validator')
const validate = require('../../../lib')

const suggestOptions = async (options) => {
    // TODO: Comment out, may we use it if we decide to use prompts

    // const blamelessInitialQuestion = []
    // if (!options.filePath) {
    //     blamelessInitialQuestion.push({
    //         type: 'input',
    //         name: 'filePath',
    //         message: 'Please provide path: ',
    //     })
    // }

    // //const answer = await inquirer.prompt(blamelessInitialQuestion)
    const result = await validate(options?.filePath, options?.source)
    return {
        ...options,
        filePath: options.filePath || answer?.filePath,
        isValid: result?.isValid,
        validDocuments: result?.validDocuments,
    }
}

module.exports = suggestOptions
