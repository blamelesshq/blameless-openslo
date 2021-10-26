const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const updateErrorBudgetPolicyThresholdHandler = (req) => {
    try {
        const result = apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}UpdateErrorBudgetPolicyThreshold`,
            req
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThreshold
    } catch (error) {
        const errorMessage = `Unable to Update Error Budget Policy Thresholds: ${error}`
        throw errorMessage
    }
}

module.exports = updateErrorBudgetPolicyThresholdHandler
