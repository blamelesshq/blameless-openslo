const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const deleteSlosHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}DeleteSLO`, 
            req
        )

        const { status, data } = result

        return data?.slo
    } catch (error) {
        const errorMessage = `Unable to Delete SLO. [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = deleteSlosHandler
