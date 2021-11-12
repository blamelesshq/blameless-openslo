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
        const errorStatus = error.response?.status
        let errorMessage
        if (errorStatus === 401) {
            errorMessage = `Unable to Get User Journeys: Error: ${JSON.stringify(
                `${error.response?.data?.error} ${error.response?.data?.message}`
            )}`
        }
        throw errorMessage
    }
}

module.exports = getUserJourneysHandler
