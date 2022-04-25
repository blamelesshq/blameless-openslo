const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const deleteServicesHandlers = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}DeleteService`,
            req
        )

        const { status, data } = result

        return data?.service
    } catch (error) {
        const errorMessage = `Unable to Delete Services: ${error}`
        throw errorMessage
    }
}

module.exports = deleteServicesHandlers
