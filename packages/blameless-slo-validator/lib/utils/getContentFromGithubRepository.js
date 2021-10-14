const { Octokit } = require('octokit')
const { logger } = require('.')
const envConfig = require('../config/env')

const octokitInstance = new Octokit({ auth: envConfig.pat })

const getContentFromGithubRepo = async (specPath) => {
    const cleanSpecPath = specPath && specPath.replace(/\/$/, '')
    try {
        const result = await octokitInstance.request(
            'GET /repos/{owner}/{repo}/contents/{path}',
            {
                owner: envConfig.owner,
                repo: envConfig.repo,
                path: cleanSpecPath,
            }
        )

        if (result && result?.status === 200) {
            return result?.data
        }
    } catch (error) {
        logger.error(`Unable to retrieve data from Github repository \n
        Repository: ${envConfig.repo}\n
        Owner: ${envConfig.owner}\n
        Path: ${specPath}\n
        Error: ${error}\n
        Please check the information above, and update accordingly if necessary `)
        return false
    }
}

module.exports = getContentFromGithubRepo
