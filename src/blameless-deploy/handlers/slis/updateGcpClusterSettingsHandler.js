const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const updateGcpClusterSettingsHandler = async (req) => {
    try {
        const result = await apiCallHandler.put(envConfig.settings, req)

        const { status, data } = result

        return data?.response?.gcp
    } catch (error) {
        const errorMessage = `Unable to Update GCP Cluster Settings: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = updateGcpClusterSettingsHandler
