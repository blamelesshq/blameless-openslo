const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getServicesHandlers = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetServices`,
            req
        )

        const { status, data } = result

        return data?.services
    } catch (error) {
        const errorMessage = `Unable to Get Services: ${error}`
        throw errorMessage
    }
}

module.exports = getServicesHandlers
