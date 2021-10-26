const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getErrorBudgetPolicyActions = () => {
    try {
        const result = apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetErrorBudgetPolicyActions`,
            req
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThreshold
    } catch (error) {
        const errorMessage = `Unable to Get Error Budget Policy Action: ${error}`
        throw errorMessage
    }
}

module.exports = getErrorBudgetPolicyActions
