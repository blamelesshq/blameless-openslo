const getContentFromGithubHandler = require('../../blameless-deploy/handlers/shared/getContentFromGithubHandler')
const { logger } = require('.')
const envConfig = require('../config/env')

const retrieveSpecificationFromGithubRepo = async (path) => {
    const cleanSpecPath = path && path.replace(/\/$/, '')

    try {
        const result = await getContentFromGithubHandler(cleanSpecPath)
        return result
    } catch (error) {
        logger.error(error)
        logger.info(
            `GITHUB Info: \n* Repository: ${envConfig.repo}\n* Owner: ${envConfig.owner}\n* Content Path: ${path}\nPlease make sure that above information are correct.`
        )
        return false
    }
}

module.exports = retrieveSpecificationFromGithubRepo
