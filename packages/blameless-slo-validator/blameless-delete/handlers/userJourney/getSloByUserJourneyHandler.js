const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSlisByServiceIdHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSLOsByUserJourneyId`,
            req
        )

        const { status, data } = result

        return data?.slos
    } catch (error) {
        const errorMessage = `Unable to Get Slo by User Journey Id: ${error}`
        throw errorMessage
    }
}

module.exports = getSlisByServiceIdHandler
