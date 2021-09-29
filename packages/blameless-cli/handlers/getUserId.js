const envConfig = require('../lib/config/env')
const apiCall = require('../lib/utils/userAuth')

const getUserId = async (owner) => {
    try {
        const result = await apiCall(`${envConfig.userIdBase}/${owner}`)

        const { statusCode, body } = result

        return JSON.parse(body)?.response?.id
    } catch (error) {
        console.error(`Unable to retrieve user id. Error: ${error}`)
    }
}

module.exports = getUserId
