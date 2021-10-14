require('dotenv').config()

/**
 * @description Environment configuration
 */
const envConfig = {
    pat: process.env.REPOSITORY_PAT,
    owner: process.env.REPOSITORY_OWNER,
    repo: process.env.REPOSITORY_NAME,
}

module.exports = envConfig
