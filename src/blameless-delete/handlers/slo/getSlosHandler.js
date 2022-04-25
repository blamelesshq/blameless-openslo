const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSlosHandler = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSLOs`
        )

        const { status, data } = result

        return data?.slos
    } catch (error) {
        const errorMessage = `Unable to SLOs. [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getSlosHandler
