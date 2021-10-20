const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const getOrgId = async () => {
    try {
        const result = await apiCallHandler.post(envConfig.getOrgIdBase)

        const { statusCode, body } = result

        return JSON.parse(body)?.tenant_id
    } catch (error) {
        console.error(`Unable to retrieve org id. Error: ${error}`)
    }
}

module.exports = getOrgId
