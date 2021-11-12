const envConfig = require('../../lib/config/env')
const apiCallHandler = require('./apiCall')

const incidentSeverities = async () => {
    try {
        const result = await apiCallHandler.get(
            `${envConfig.incidentSeverities}`
        )

        const { status, data } = result

        return data?.severities
    } catch (error) {
        const errorMessage = `Unable to get Incident Severities. [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = incidentSeverities
