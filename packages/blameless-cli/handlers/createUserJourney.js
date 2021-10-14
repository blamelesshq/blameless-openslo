const envConfig = require('../lib/config/env')
const got = require('got')

const createUserJourney = async (token, payload) => {
    try {
        const result = await got.post(`${envConfig.createUserJourney}`, {
            json: payload,
            headers: {
                Authorization: token,
            },
        })

        const { statusCode, body } = result

        console.log(body)
    } catch (error) {
        console.error(`Unable to create User Journey. Error: ${error}`)
    }
}

module.exports = createUserJourney
