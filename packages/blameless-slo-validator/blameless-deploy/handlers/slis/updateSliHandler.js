const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const updateSliHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}UpdateSLI`,
            req
        )

        const { status, data } = result

        return data?.sli
    } catch (error) {
        const errorMessage = `Unable to Update SLI. Error: ${error}`
        throw errorMessage
    }
}

module.exports = updateSliHandler
