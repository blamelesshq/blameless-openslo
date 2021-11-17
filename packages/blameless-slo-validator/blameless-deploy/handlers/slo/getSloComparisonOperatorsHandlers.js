const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getSloComparisonOperatorsHandlers = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetSloComparisonOperators`
        )

        const { status, data } = result

        return data?.sloComparisonOperators
    } catch (error) {
        const errorMessage = `Unable to get comparison operators. [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getSloComparisonOperatorsHandlers
