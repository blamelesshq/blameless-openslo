const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const deleteErrorBudgetPolicyThresholdsHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}DeleteErrorBudgetPolicyThreshold`,
            req
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThresholds
    } catch (error) {
        const errorMessage = `Unable to Delete Error Budget Policy Thresholds: ${error}`
        throw errorMessage
    }
}

module.exports = deleteErrorBudgetPolicyThresholdsHandler
