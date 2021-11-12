const envConfig = require('../../lib/config/env')

const getAuthToken = () => {
    return envConfig.tempAuthToken
}

module.exports = getAuthToken;
