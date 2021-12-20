const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getErrorBudgetPoliciesHandler = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetErrorBudgetPolicies`
        )

        const { status, data } = result

        return data?.errorBudgetPolicies
    } catch (error) {
        const errorMessage = `Unable to GET Error Budget Policies: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getErrorBudgetPoliciesHandler
