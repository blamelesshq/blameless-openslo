const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getErrorBudgetPolicyThresholdTypesHanlder = () => {
    try {
        const result = apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetErrorBudgetPolicyThresholdTypes`
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThresholdTypes
    } catch (error) {
        const errorMessage = `Unable to Get Error Budget Policy Threshold Types: ${error}`
        throw errorMessage
    }
}

module.exports = getErrorBudgetPolicyThresholdTypesHanlder
