const envConfig = require('../../../lib/config/env')
const apiCallHandler = require('./apiCall')
const axios = require('axios').default


const m2mAuth = async (body) => {
    try {
        const result = await axios.post(envConfig.m2m, body)

        const { status, data } = result

        return data?.access_token
    } catch (error) {
        const errorMessage = `Unable Get access token: [${error?.response?.data?.error}]: ${error?.response?.data?.message}`
        throw errorMessage
    }
}

module.exports = m2mAuth
