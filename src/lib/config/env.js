const getBlamelessConfig = require('../utils/getBlamelessConfig')
const isConfigSet = require('../utils/checkConfig')

let config
if (isConfigSet()) {
    config = getBlamelessConfig()
}

const BLAMELESS_TENANT_DOMAIN = 
    (process.env.BLAMELESS_TENANT_DOMAIN &&
        process.env.BLAMELESS_TENANT_DOMAIN.includes('/api/')
        ? process.env.BLAMELESS_TENANT_DOMAIN
        : `${process.env.BLAMELESS_TENANT_DOMAIN}/api/v1/`)

/**
 * @description Environment configuration
 */
const envConfig = {
    pat: config?.REPOSITORY_PAT,
    owner: config?.REPOSITORY_OWNER,
    repo: config?.REPOSITORY_NAME,
    // loginBase: process.env.BLAMELESS_OAUTH_BASE,
    clientId: process.env.BLAMELESS_OAUTH_CLIENT_ID,
    clientSecret: process.env.BLAMELESS_OAUTH_CLIENT_SECRET,
    audience: process.env.BLAMELESS_OAUTH_AUDIENCE,
    grandType: "client_credentials",
    getOrgIdBase: `${BLAMELESS_TENANT_DOMAIN}/identity/tenant`,
    userIdBase: `${BLAMELESS_TENANT_DOMAIN}identity/user/authName/`,
    incidentSeverities: `${BLAMELESS_TENANT_DOMAIN}/incident-severities`,
    tempAuthToken: config?.BLAMELESS_TEMP_AUTH_TOKEN,
    settings: `${BLAMELESS_TENANT_DOMAIN}prometheus/settings`,
    blamelessTenantBaseUrl: `${BLAMELESS_TENANT_DOMAIN}/services/SLOServiceCrud/`,
    blamelessTenantBaseSloCustomApiUrl: `${BLAMELESS_TENANT_DOMAIN}/services/SLOService/`,
    m2m: `https://blamelesshq.auth0.com/oauth/token`,
}

module.exports = envConfig
