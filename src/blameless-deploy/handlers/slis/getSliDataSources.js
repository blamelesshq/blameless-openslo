const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSliDataSources = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}/GetSliDataSources`
        )

        const { status, data } = result

        return data && data?.sliDataSources
    } catch (error) {
        const errorMessage = `Unable to get Data Sources Error: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getSliDataSources
