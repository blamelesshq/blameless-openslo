const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSlosByJourneyIdHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSLOsByUserJourneyId`,
            req
        )

        const { status, data } = result

        return data?.slos
    } catch (error) {
        const errorMessage = `Unable to Get SLOs associated with User Journey ID: ${req?.userJourneyId}. Error: ${error}`
        throw errorMessage
    }
}

module.exports = getSlosByJourneyIdHandler
