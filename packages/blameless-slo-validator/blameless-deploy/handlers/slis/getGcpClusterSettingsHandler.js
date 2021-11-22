const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const getGcpClusterSettingsHandler = async () => {
    try {
        const result = await apiCallHandler.get(envConfig.settings)

        const { status, data } = result

        return data
    } catch (error) {
        const errorMessage = `Unable to GET GCP Cluster Settings: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getGcpClusterSettingsHandler
