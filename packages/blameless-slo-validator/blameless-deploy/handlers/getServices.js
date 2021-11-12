const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const getServices = async (method) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}/GetServices`
        )

        const { status, data } = result

        return data && data?.services
    } catch (error) {
        const errorMessage = `Unable to get Services Error: ${error}`
        throw errorMessage
    }
}

module.exports = getServices
