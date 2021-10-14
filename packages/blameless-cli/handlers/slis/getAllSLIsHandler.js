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
        const errorMessage = `Unable to retrieve SLIs. Error: ${error}`
        throw errorMessage
    }
}

module.exports = getAllSLIs
