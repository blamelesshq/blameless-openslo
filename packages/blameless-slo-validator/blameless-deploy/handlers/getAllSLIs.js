const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const getAllSLIs = async (method) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}/GetSLIs`
        )

        const { statusCode, body } = result

        return JSON.parse(body)?.slis
    } catch (error) {
        console.error(`Unable to retrieve SLIs. Error: ${error}`)
    }
}

module.exports = getAllSLIs
