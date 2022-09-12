const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const deleteUserJourneyHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}DeleteUserJourney`,
            req
        )

        const { status, data } = result

        return data?.userJourney
    } catch (error) {
        const errorMessage = `Unable to Delete User Journey: ${error}`
        throw errorMessage
    }
}

module.exports = deleteUserJourneyHandler
