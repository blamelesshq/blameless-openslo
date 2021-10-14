const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const createUserJourneyHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}CreateUserJourney`,
            req
        )

        const { status, data } = result

        return data
    } catch (error) {
        const errorMessage = `Unable to Create User Journey Error: ${error}`
        throw errorMessage
    }
}

module.exports = createUserJourneyHandler
