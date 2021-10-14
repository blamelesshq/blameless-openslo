const axios = require('axios').default
const envConfig = require('../../lib/config/env')
const getAuthToken = require('./getToken')

const apiCallHandler = axios.create({
    baseURL: envConfig.blamelessTenantBaseUrl,
    headers: {
        authorization: getAuthToken(),
    },
})

apiCallHandler.interceptors.request.use((req) => {
    return req
})

// apiCallHandler.interceptors.response.use(
//     (response) => {
//         if (response.status === 401) {
//             console.log('Please login.. unauthorized')
//         }
//     },
//     (error) => {
//         if (error.response.status === 404) {
//             throw new Error(`${err.error.url} not found`)
//         }
//         if (error.response.status === 401) {
//             throw new Error(`Unauthorized!`)
//         }
//         throw error
//     }
// )

module.exports = apiCallHandler
