const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const getAllSliTypes = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}/GetSliTypes`
        )

        const { status, data } = result

        return data && data?.sliTypes
    } catch (error) {
        const errorMessage = `Unable to get SLI Types Error: ${error}`
        throw errorMessage
    }
}

module.exports = getAllSliTypes
