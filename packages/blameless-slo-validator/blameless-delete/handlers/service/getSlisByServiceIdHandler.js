const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSlisByServiceIdHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSLIsByServiceId`,
            req
        )

        const { status, data } = result

        return data?.slis
    } catch (error) {
        const errorMessage = `Unable to Get Slis by Service Id: ${error}`
        throw errorMessage
    }
}

module.exports = getSlisByServiceIdHandler
