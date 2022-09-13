const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const deleteSliHandler = async (req) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseUrl}DeleteSLI`,
            req
        )

        const { status, data } = result

        return data?.sli
    } catch (error) {
        const errorMessage = `Unable to Delete SLI. Error: ${error}`
        throw errorMessage
    }
}

module.exports = deleteSliHandler
