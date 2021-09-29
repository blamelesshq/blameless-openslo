const envConfig = require('../lib/config/env')
const apiCall = require('../lib/utils/userAuth')

const getAllSliTypes = async (method) => {
    try {
        const result = await apiCall(
            `${envConfig.blamelessTenantBaseUrl}/GetSliTypes`,
            method
        )

        const { statusCode, body } = result

        return JSON.parse(body)?.sliTypes
    } catch (error) {
        console.error(`Unable to retrieve SLI Types. Error: ${error}`)
    }
}

module.exports = getAllSliTypes
