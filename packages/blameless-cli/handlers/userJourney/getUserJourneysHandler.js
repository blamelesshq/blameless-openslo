const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getUserJourneysHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetUserJourneys`,
            req
        )

        const { status, data } = result

        return data?.userJourneys
    } catch (error) {
        const errorMessage = `Unable to Get User Journeys: ${error}`
        throw errorMessage
    }
}

module.exports = getUserJourneysHandler
