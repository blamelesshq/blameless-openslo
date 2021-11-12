const envConfig = require('../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getErrorBudgetPolicyActionsType = async () => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}GetErrorBudgetPolicyActionTypes`
        )

        const { status, data } = result

        return data?.errorBudgetPolicyActionTypes
    } catch (error) {
        const errorMessage = `Unable to Get Error Budget Policy Action: ${error}`
        throw errorMessage
    }
}

module.exports = getErrorBudgetPolicyActionsType
