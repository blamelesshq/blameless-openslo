const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSlosBySliIdHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSLOsBySliId`,
            req
        )

        const { status, data } = result

        return data?.slos
    } catch (error) {
        const errorMessage = `Unable to Get SLOs associated with SLI ID: ${req?.sliId}. Error: ${error}`
        throw errorMessage
    }
}

module.exports = getSlosBySliIdHandler
