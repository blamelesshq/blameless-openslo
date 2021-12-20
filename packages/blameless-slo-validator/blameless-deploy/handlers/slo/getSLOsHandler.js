const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSLOsHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSLOs`,
            req
        )

        const { status, data } = result

        return data?.slos
    } catch (error) {
        const errorMessage = `Unable to Get SLOs.`
        throw errorMessage
    }
}

module.exports = getSLOsHandler
