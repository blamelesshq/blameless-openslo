const getBlamelessConfig = require('../utils/getBlamelessConfig')
const isConfigSet = require('../utils/checkConfig')

let config
if (isConfigSet()) {
    config = getBlamelessConfig()
}

/**
 * @description Environment configuration
 */
const envConfig = {
    pat: config?.REPOSITORY_PAT,
    owner: config?.REPOSITORY_OWNER,
    repo: config?.REPOSITORY_NAME,
    loginBase: process.env.BLAMELESS_OAUTH_BASE,
    clientId: process.env.BLAMELESS_OAUTH_CLIENT_ID,
    clientSecret: process.env.BLAMELESS_OAUTH_CLIENT_SECRET,
    audience: process.env.BLAMELESS_OAUTH_AUDIENCE,
    grandType: process.env.BLAMELESS_OAUTH_GRAND_TYPE,
    getOrgIdBase: `${config?.BLAMELESS_TENANT_BASE_URL}/identity/tenant`,
    userIdBase: `${config?.BLAMELESS_TENANT_BASE_URL}/identity/user/authName/`,
    tempAuthToken: config?.BLAMELESS_TEMP_AUTH_TOKEN,
    blamelessTenantBaseUrl: `${config?.BLAMELESS_TENANT_BASE_URL}/services/SLOServiceCrud/`,
}

module.exports = envConfig
