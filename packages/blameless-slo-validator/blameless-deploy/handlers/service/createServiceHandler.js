const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const createServiceHandlers = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}CreateService`,
            req
        )

        const { status, data } = result

        return data?.service
    } catch (error) {
        const errorMessage = `Unable to Get Services: ${error}`
        throw errorMessage
    }
}

module.exports = createServiceHandlers
