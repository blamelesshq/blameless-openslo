const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const deleteErrorBudgetPolicyHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}DeleteErrorBudgetPolicy`,
            req
        )

        const { status, data } = result

        return data?.errorBudgetPolicy
    } catch (error) {
        const errorMessage = `Unable to UPDATE Error Budget Policy: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = deleteErrorBudgetPolicyHandler
