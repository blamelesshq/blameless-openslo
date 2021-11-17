const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const updateServiceHandlers = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}UpdateService`,
            req
        )

        const { status, data } = result

        return data?.service
    } catch (error) {
        const errorMessage = `Unable to Update Service: ${error}`
        throw errorMessage
    }
}

module.exports = updateServiceHandlers
