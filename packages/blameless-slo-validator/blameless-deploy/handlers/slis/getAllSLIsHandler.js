const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getAllSLIs = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}/GetSLIs`
        )

        const { status, data } = result

        return data && data?.slis
    } catch (error) {
        const errorMessage = `Unable to retrieve SLIs. [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getAllSLIs
