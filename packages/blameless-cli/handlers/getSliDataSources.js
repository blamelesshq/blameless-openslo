const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const getSliDataSources = async (method) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}/GetSliDataSources`
        )

        const { status, data } = result

        return data && data?.sliDataSources
    } catch (error) {
        const errorMessage = `Unable to get Data Sources Error: ${error}`
        throw errorMessage
    }
}

module.exports = getSliDataSources
