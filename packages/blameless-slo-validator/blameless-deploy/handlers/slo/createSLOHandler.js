const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const createSLOHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}CreateSLO`,
            req
        )

        const { status, data } = result

        return data?.slo
    } catch (error) {
        const errorMessage = `Unable to Create SLO. Looks that something is not okay with your request.`
        throw errorMessage
    }
}

module.exports = createSLOHandler
