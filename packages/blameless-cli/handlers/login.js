const envConfig = require('../lib/config/env')
const apiCallHandler = require('./shared/apiCall')

const login = async () => {
    const authRequest = {
        client_id: envConfig.clientId,
        client_secret: envConfig.clientSecret,
        audience: envConfig.audience,
        grant_type: envConfig.grandType,
    }

    try {
        const result = await apiCallHandler.post(
            envConfig.loginBase,
            authRequest
        )

        const { statusCode, body } = result

        return `${JSON.parse(body)?.token_type} ${
            JSON.parse(body)?.access_token
        }`
    } catch (error) {
        console.error(`Unable to login. Error: ${error}`)
    }
}

module.exports = login
