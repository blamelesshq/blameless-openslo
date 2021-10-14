const got = require('got')
const userLogin = require('../../handlers/login')
const envConfig = require('../config/env')

const logger = got.extend({
    handlers: [
        (options, next) => {
            console.log(`Sending ${options.method} to ${options.url}`)
            return next(options)
        },
    ],
})

const instance = got.extend({
    hooks: {
        afterResponse: [
            (response, retryWithMergedOptions) => {
                if (response.statusCode === 401) {
                    const updatedOptions = {
                        headers: {
                            Authorization: userLogin(),
                        },
                    }

                    instance.defaults.options = got.mergeOptions(
                        instance.defaults.options,
                        updatedOptions
                    )

                    return retryWithMergedOptions(updatedOptions)
                }

                return response
            },
        ],
        beforeRequest: [
            (options) => {
                if (
                    !options.options?.headers ||
                    !options.options?.headers.Authorization
                ) {
                    throw new Error('Token required')
                }

                options.headers.Authorization =
                    options.options?.headers.Authorization

                options.method = options.options?.method
            },
        ],
        beforeRetry: [(options, error, retryCount) => {}],
    },
})

const apiCall = async (url, method) => {
    const options = {
        method: method ? method : 'GET',
        headers: {
            Authorization: `Bearer ${envConfig.tempAuthToken}`,
        },
    }

    const response = await instance(url, { options })
    return response
}

module.exports = apiCall
