const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getErrorBudgetPolicyThresholdsHandler = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetErrorBudgetPolicyThresholds`
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThresholds
    } catch (error) {
        const errorMessage = `Unable to Get Error Budget Policy Thresholds: ${error}`
        throw errorMessage
    }
}

module.exports = getErrorBudgetPolicyThresholdsHandler
