const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const createServiceHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}CreateService`,
            req
        )

        const { status, data } = result

        return data
    } catch (error) {
        const errorMessage = `Unable to create new service. Error: ${error}`
        throw errorMessage
    }
}

module.exports = createServiceHandler
