const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getErrorBudgetPolicyThresholdTypesHanlder = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetErrorBudgetPolicyThresholdTypes`
        )

        const { status, data } = result

        return data?.errorBudgetPolicyThresholdTypes
    } catch (error) {
        const errorMessage = `Unable to Get Error Budget Policy Threshold Types: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getErrorBudgetPolicyThresholdTypesHanlder
