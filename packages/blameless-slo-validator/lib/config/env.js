const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../../.env') })

/**
 * @description Environment configuration
 */
const envConfig = {
    pat: process.env.REPOSITORY_PAT,
    owner: process.env.REPOSITORY_OWNER,
    repo: process.env.REPOSITORY_NAME,
}

module.exports = envConfig
