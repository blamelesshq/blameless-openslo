const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const updateSLOHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}UpdateSLO`,
            req
        )

        const { status, data } = result

        return data?.slo
    } catch (error) {
        const errorMessage = `Unable to Update SLO. Looks that something is not okay with your request.`
        throw errorMessage
    }
}

module.exports = updateSLOHandler
