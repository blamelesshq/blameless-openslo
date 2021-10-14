const envConfig = require('../../lib/config/env')
const apiCallHandler = require('./apiCall')

const getUserId = async (owner) => {
    try {
        const result = await apiCallHandler.get(
            `${envConfig.userIdBase}${owner}`
        )

        const { status, data } = result

        return data?.response?.id
    } catch (error) {
        const errorMessage = `Unable to get userId. ${error}`
        throw errorMessage
    }
}

module.exports = getUserId
