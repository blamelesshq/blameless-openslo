const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('../shared/apiCall')

const GetSliByName = async (sliName) => {
    try {
        const result = await apiCallHandler.post(
            `${envConfig.blamelessTenantBaseSloCustomApiUrl}/GetSliByName`, 
            {
                name: sliName
            }
        )

        const { _, data } = result

        return data && data?.sli
    } catch (error) {
        const errorMessage = `Unable to retrieve SLIs. [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = GetSliByName
