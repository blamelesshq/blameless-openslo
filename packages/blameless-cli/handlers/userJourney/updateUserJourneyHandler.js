const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const updateUserJourneyHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}UpdateUserJourney`,
            req
        )

        const { status, data } = result

        return data
    } catch (error) {
        const errorMessage = `Unable to Update User Journey with id: ${req?.id} Error: ${error}`
        throw errorMessage
    }
}

module.exports = updateUserJourneyHandler
