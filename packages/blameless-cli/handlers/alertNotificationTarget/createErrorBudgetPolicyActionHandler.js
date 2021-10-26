const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const createErrorBudgetPolicyAction = (req) => {
    try {
        const result = apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}CreateErrorBudgetPolicyAction`,
            req
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThreshold
    } catch (error) {
        const errorMessage = `Unable to Create Error Budget Policy Action: ${error}`
        throw errorMessage
    }
}

module.exports = createErrorBudgetPolicyAction
