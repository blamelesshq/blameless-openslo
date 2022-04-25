const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('./apiCall')

const getOrgId = async () => {
    try {
        const result = await apiCallHandler.get(envConfig.getOrgIdBase)

        const { status, data } = result

        return data?.tenant_id
    } catch (error) {
        const errorMessage = `Unable to Get OrgId: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = getOrgId
