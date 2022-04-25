const axios = require('axios').default
const envConfig = require('../../../lib/config/env')

const githubIntegrate = axios.create({
    baseURL: `https://api.github.com/repos/${envConfig.owner}/${envConfig.repo}/`,
    headers: {
        authorization: `token ${envConfig.pat}`,
    },
})

githubIntegrate.interceptors.request.use((req) => {
    return req
})

githubIntegrate.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMsg = `[STATUS]: ${error?.response?.status}  [MESSAGE]: ${error?.response?.data?.message}`
        return Promise.reject(errorMsg)
    }
)

module.exports = githubIntegrate
