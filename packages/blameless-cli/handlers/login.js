const envConfig = require('../lib/config/env')
const got = require('got')

const login = async () => {
    const authRequest = {
        client_id: envConfig.clientId,
        client_secret: envConfig.clientSecret,
        audience: envConfig.audience,
        grant_type: envConfig.grandType,
    }

    try {
        const result = await got.post(envConfig.loginBase, {
            json: authRequest,
        })

        const { statusCode, body } = result

        const token = `${JSON.parse(body)?.token_type} ${
            JSON.parse(body)?.access_token
        }`

        return token
    } catch (error) {
        console.error(`Unable to login. Error: ${error}`)
    }
}

module.exports = login
