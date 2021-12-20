const github = require('../shared/githubIntegration')
const envConfig = require('../../../lib/config/env')

const getContentFromGithubHandler = async (path) => {
    try {
        const result = await github.get(
            `https://api.github.com/repos/${envConfig.owner}/${envConfig.repo}/contents/${path}`
        )

        const { status, data } = result

        return data
    } catch (error) {
        const errorMessage = `Unable to Get Data From Github: ${error}`
        throw errorMessage
    }
}

module.exports = getContentFromGithubHandler
