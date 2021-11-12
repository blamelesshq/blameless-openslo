const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSloMetricUnitTypesHandler = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSloMetricUnitTypes`
        )

        const { status, data } = result

        return data?.sloMetricUnitTypes
    } catch (error) {
        const errorMessage = `Unable to GET SLO Metric Types: ${error}`
        throw errorMessage
    }
}

module.exports = getSloMetricUnitTypesHandler
