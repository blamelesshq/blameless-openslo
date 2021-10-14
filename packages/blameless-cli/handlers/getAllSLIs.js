const envConfig = require('../lib/config/env')
const apiCall = require('../lib/utils/userAuth')

const getAllSLIs = async (method) => {
    try {
        const result = await apiCall(
            `${envConfig.blamelessTenantBaseUrl}/GetSLIs`,
            method
        )

        const { statusCode, body } = result

        return JSON.parse(body)?.slis
    } catch (error) {
        console.error(`Unable to retrieve SLIs. Error: ${error}`)
    }
}

module.exports = getAllSLIs
