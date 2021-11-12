const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const deleteErrorBudgetPolicyActionHandler = async (req) => {
    try {
        const result = apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}DeleteErrorBudgetPolicyAction`,
            req
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThresholds
    } catch (error) {
        const errorMessage = `Unable to Delete Error Budget Policy Action: ${error}`
        throw errorMessage
    }
}

module.exports = deleteErrorBudgetPolicyActionHandler
