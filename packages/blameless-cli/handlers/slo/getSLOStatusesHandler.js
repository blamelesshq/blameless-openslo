const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSLOStatusesHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSloStatuses`,
            req
        )

        const { status, data } = result

        return data?.sloStatuses
    } catch (error) {
        const errorMessage = `Unable to GET SLO Statuses: ${error}`
        throw errorMessage
    }
}

module.exports = getSLOStatusesHandler
