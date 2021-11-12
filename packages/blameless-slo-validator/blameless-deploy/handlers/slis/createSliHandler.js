const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const createSliHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}CreateSLI`,
            req
        )

        const { status, data } = result

        return data
    } catch (error) {
        const errorMessage = `Unable to Create SLI. Error: ${error}`
        throw errorMessage
    }
}

module.exports = createSliHandler
