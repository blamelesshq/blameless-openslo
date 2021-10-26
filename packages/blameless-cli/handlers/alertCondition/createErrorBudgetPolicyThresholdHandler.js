const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const createErrorBudgetPolicyThreshold = (req) => {
    try {
        const result = apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}CreateErrorBudgetPolicyThreshold`,
            req
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThreshold
    } catch (error) {
        const errorMessage = `Unable to Create Error Budget Policy Thresholds: ${error}`
        throw errorMessage
    }
}

module.exports = createErrorBudgetPolicyThreshold
