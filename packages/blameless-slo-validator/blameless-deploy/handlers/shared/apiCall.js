const axios = require('axios').default
const envConfig = require('../../../lib/config/env')
const getAuthToken = require('./getToken')
const logger = require('../../../lib/utils/logger')

const apiCallHandler = axios.create({
    baseURL: envConfig.blamelessTenantBaseUrl,
    headers: {
        authorization: getAuthToken(),
    },
})

apiCallHandler.interceptors.request.use((req) => {
    return req
})

apiCallHandler.interceptors.response.use(
    (response) => response,
    (error) => {
        const responseStatusCode = error.response ? error.response.status : null
        let failedRequest = error.config

        if (responseStatusCode && responseStatusCode === 401) {
            logger.info('Unauthorized!. Trying to get new auth token')

            //TODO: Once API for getting token is ready, we should change getAuthToken() method
            // If there is API for Refresh token, probably we should invoke that API aswell

            apiCallHandler.defaults.headers[
                'authorization'
            ] = `Bearer ${getAuthToken()}`

            failedRequest.headers['authorization'] = `Bearer ${getAuthToken()}`

            return axios.request(failedRequest)
        } else {
            logger.error(
                `[${error?.response?.data?.error}]: ${error?.response?.data?.message}`
            )

            return Promise.reject(error)
        }
    }
)

module.exports = apiCallHandler
