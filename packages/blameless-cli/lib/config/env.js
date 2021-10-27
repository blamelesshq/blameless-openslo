const getBlamelessConfig = require('../utils/getBlamelessConfig')
const isConfigSet = require('../utils/checkConfig')

let config
if (isConfigSet()) {
    config = getBlamelessConfig()
}

const BLAMELESS_TENANT_DOMAIN =
    config?.BLAMELESS_TENANT_DOMAIN &&
    config?.BLAMELESS_TENANT_DOMAIN.includes('/api/')
        ? config?.BLAMELESS_TENANT_DOMAIN
        : `${config?.BLAMELESS_TENANT_DOMAIN}/api/v1/`

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
    getOrgIdBase: `${BLAMELESS_TENANT_DOMAIN}/identity/tenant`,
    userIdBase: `${BLAMELESS_TENANT_DOMAIN}/identity/user/authName/`,
    tempAuthToken: config?.BLAMELESS_TEMP_AUTH_TOKEN,
    blamelessTenantBaseUrl: `${BLAMELESS_TENANT_DOMAIN}/services/SLOServiceCrud/`,
}

module.exports = envConfig
